import Map "mo:core/Map";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserId = Principal;
  public type MessageId = Nat;
  public type GroupId = Text;
  public type Timestamp = Int;
  public type Points = Nat;
  public type Status = Text;

  public type UserProfile = {
    username : Text;
    bio : Text;
    profilePicture : { url : Text; contentType : Text };
    followers : [UserId];
    following : [UserId];
    status : Status;
    points : Nat;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    lastDailyRewardClaim : ?Timestamp;
    rewardsClaimed : Nat;
    dailyLoginStreak : Nat;
    publishedAppsCount : Nat;
    badges : [Badge];
    isPremiumMember : Bool;
    premiumExpiresAt : ?Timestamp;
    freeTrialStartTime : ?Timestamp;
    freeTrialExpiresAt : ?Timestamp;
    lastOnline : Timestamp;
    musicUploads : [MusicUpload];
  };

  public type Badge = {
    name : Text;
    description : Text;
    earnedAt : Timestamp;
    typeId : Nat;
  };

  public type Message = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
  };

  public type DirectMessage = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
  };

  public type Group = {
    id : GroupId;
    name : Text;
    description : Text;
    createdBy : UserId;
    members : [UserId];
    createdAt : Timestamp;
  };

  public type GroupMessage = {
    id : Text;
    groupId : GroupId;
    sender : UserId;
    content : Text;
    mediaAttachment : ?MediaAttachment;
    timestamp : Timestamp;
  };

  public type MediaAttachment = {
    url : Text;
    contentType : Text;
    mediaType : { #image; #video; #audio };
  };

  public type SearchResult = {
    userId : UserId;
    username : Text;
    bio : Text;
    profilePicture : { url : Text; contentType : Text };
    followerCount : Nat;
    followingCount : Nat;
  };

  public type FeedItem = {
    userId : UserId;
    username : Text;
    status : Status;
    timestamp : Timestamp;
  };

  public type BlobReference = {
    id : Text;
    blob : Storage.ExternalBlob;
    name : Text;
    contentType : Text;
    uploadedBy : UserId;
    uploadTime : Timestamp;
  };

  public type PublishedApp = {
    title : Text;
    developerName : Text;
    creatorId : UserId;
    link : Text;
    publishedAt : Timestamp;
    description : Text;
    previewImage : Text;
  };

  public type PremiumContent = {
    id : Text;
    title : Text;
    description : Text;
    releaseTime : Timestamp;
  };

  public type LiveStream = {
    id : Nat;
    creatorId : UserId;
    title : Text;
    description : Text;
    streamURL : Text;
    isLive : Bool;
    startedAt : ?Timestamp;
    scheduledTime : ?Timestamp;
    viewerCount : Nat;
    thumbnailImage : Text;
  };

  public type UpcomingFeature = {
    title : Text;
    description : Text;
    plannedRelease : Timestamp;
    status : { #planned; #inProgress; #testing; #released };
  };

  public type UpcomingGame = {
    title : Text;
    description : Text;
    genre : Text;
  };

  public type SearchHistoryEntry = {
    userId : UserId;
    searchTerm : Text;
    searchType : Text;
    timestamp : Timestamp;
  };

  // Points System data
  public type PointsTransaction = {
    id : Text;
    userId : UserId;
    amount : Int;
    transactionType : TransactionType;
    description : Text;
    timestamp : Timestamp;
  };

  public type TransactionType = { #earn; #spend; #purchase };

  public type PointsStoreItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    createdAt : Timestamp;
  };

  public type DailyReward = {
    id : Text;
    userId : UserId;
    points : Nat;
    timestamp : Timestamp;
    claimed : Bool;
  };

  let pointsStore = Map.empty<Text, PointsStoreItem>();
  let transactions = Map.empty<Text, PointsTransaction>();
  let dailyRewards = Map.empty<Text, DailyReward>();
  let musicUploads = Map.empty<Text, MusicUpload>();

  // Daily Items Secret types and data
  public type MysteryItem = {
    id : Text;
    itemType : MysteryItemType;
    name : Text;
    description : Text;
    pointsReward : ?Nat;
    visualUrl : ?Text;
    rewardCooldown : ?Nat;
  };

  public type MysteryItemType = { #points; #badge; #visual; #message };

  public type DailyMysteryItemData = {
    id : Text;
    userId : UserId;
    dailyItemBoxOpened : Bool;
    newDailyItemResult : ?MysteryItem;
    lastDailyItemClaim : ?Timestamp;
  };

  // State for daily items secret
  let dailyItemsRewardHistory = Map.empty<Text, DailyMysteryItemData>();
  let mysteryItems = Map.empty<Text, MysteryItem>();
  let dailyItemsLastReward = Map.empty<UserId, MysteryItem>();

  // Stripe integration configuration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Search Engine Store Types and State
  public type SearchEngine = {
    id : Text;
    name : Text;
    description : Text;
    apiUrl : Text;
  };

  public type UserSearchPreferences = {
    defaultSearchEngine : Text;
    searchHistory : List.List<SearchHistoryEntry>;
  };

  let availableSearchEngines = Map.fromIter<Text, SearchEngine>(
    [
      (
        "ultra_search",
        {
          id = "ultra_search";
          name = "Ultra Search";
          description = "Fast and accurate web search engine";
          apiUrl = "https://api.ultrasearch.com/search";
        },
      ),
    ].values()
  );

  let userSearchPreferences = Map.empty<UserId, UserSearchPreferences>();

  // Persistent state
  let profiles = Map.empty<UserId, UserProfile>();
  let publishedApps = Map.empty<Text, PublishedApp>();
  let messages = Map.empty<MessageId, Message>();
  let messageIdCounter = Map.empty<UserId, MessageId>();
  let blobs = Map.empty<Text, BlobReference>();
  let premiumContent = Map.empty<Text, PremiumContent>();
  let liveStreams = Map.empty<Nat, LiveStream>();
  let upcomingFeatures = Map.empty<Text, UpcomingFeature>();
  let upcomingGames = Map.empty<Text, UpcomingGame>();
  let searchHistory = List.empty<SearchHistoryEntry>();
  let streamIdCounter = Map.empty<UserId, Nat>();

  // Group messaging state
  let groups = Map.empty<GroupId, Group>();
  let groupMessages = Map.empty<GroupId, List.List<GroupMessage>>();
  let groupMessageCounter = Map.empty<GroupId, Nat>();

  // Direct messages state (conversation history)
  let directMessages = List.empty<DirectMessage>();
  var directMessageIdCounter : MessageId = 0;

  public type MusicUpload = {
    id : Text;
    title : Text;
    artist : Text;
    genre : Text;
    file : Storage.ExternalBlob;
    uploadedBy : UserId;
    uploadTime : Timestamp;
  };

  // Helper Functions
  func hasEarnedBadge(profile : UserProfile, badgeName : Text) : Bool {
    profile.badges.find(
      func(b) { b.name == badgeName }
    ) != null;
  };

  func getDailyLoginStreak(profile : UserProfile, currentTime : Timestamp) : Nat {
    let dayLengthNanos = 24 * 60 * 60 * 1000000000;
    let lastClaimDay = switch (profile.lastDailyRewardClaim) {
      case (null) { 0 };
      case (?timestamp) { timestamp / dayLengthNanos };
    };
    let currentDay = currentTime / dayLengthNanos;

    if (lastClaimDay == currentDay) {
      profile.dailyLoginStreak;
    } else if (lastClaimDay == currentDay - 1) {
      profile.dailyLoginStreak + 1;
    } else {
      1;
    };
  };

  func getAllFollowersCount(profiles : Map.Map<UserId, UserProfile>, userId : UserId) : Nat {
    switch (profiles.get(userId)) {
      case (null) { 0 };
      case (?profile) { profile.followers.size() };
    };
  };

  func canClaimDailyReward(profile : UserProfile, currentTime : Timestamp) : Bool {
    let dayLengthNanos = 24 * 60 * 60 * 1000000000;
    switch (profile.lastDailyRewardClaim) {
      case (null) { true };
      case (?lastClaim) {
        let lastClaimDay = lastClaim / dayLengthNanos;
        let currentDay = currentTime / dayLengthNanos;
        currentDay > lastClaimDay;
      };
    };
  };

  func isPremiumMember(caller : UserId) : Bool {
    switch (profiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.premiumExpiresAt) {
          case (null) { profile.isPremiumMember };
          case (?expiresAt) {
            Time.now() < expiresAt;
          };
        };
      };
    };
  };

  func isAdmin(caller : UserId) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  func hasActiveFreeTrial(profile : UserProfile) : Bool {
    switch (profile.freeTrialStartTime, profile.freeTrialExpiresAt) {
      case (null, _) { false };
      case (?start, null) { Time.now() >= start };
      case (?start, ?end) { Time.now() >= start and Time.now() < end };
    };
  };

  func updatePointsBalance(userId : UserId, amount : Int) : async () {
    switch (profiles.get(userId)) {
      case (null) { () };
      case (?profile) {
        let updatedPoints = if (amount >= 0) {
          amount.toNat();
        } else if (profile.points >= (-amount).toNat()) {
          profile.points - (-amount).toNat();
        } else { 0 };
        let updatedProfile = {
          profile with
          points = updatedPoints;
          updatedAt = Time.now();
        };
        profiles.add(userId, updatedProfile);
      };
    };
  };

  func recordTransaction(userId : UserId, amount : Int, transactionType : TransactionType, description : Text) : async () {
    let transactionId = userId.toText() # "_" # Time.now().toText();
    let transaction = {
      id = transactionId;
      userId;
      amount;
      transactionType;
      description;
      timestamp = Time.now();
    };
    transactions.add(transactionId, transaction);
  };

  func verifyDailyReward(userId : UserId, points : Nat) : Bool {
    switch (profiles.get(userId)) {
      case (null) { false };
      case (?profile) {
        canClaimDailyReward(profile, Time.now());
      };
    };
  };

  func getDailyRewardStreak(userId : UserId) : Nat {
    switch (profiles.get(userId)) {
      case (null) { 1 };
      case (?profile) {
        getDailyLoginStreak(profile, Time.now());
      };
    };
  };

  func isGroupMember(groupId : GroupId, userId : UserId) : Bool {
    switch (groups.get(groupId)) {
      case (null) { false };
      case (?group) {
        group.members.find(func(m) { m == userId }) != null;
      };
    };
  };

  // Daily Items Secret logic
  func canClaimDailySecret(userId : UserId) : Bool {
    let dayLengthNanos = 24 * 60 * 60 * 1000000000;
    let lastClaim = switch (dailyItemsRewardHistory.get(userId.toText())) {
      case (null) { 0 };
      case (?data) {
        switch (data.lastDailyItemClaim) {
          case (null) { 0 };
          case (?timestamp) { timestamp };
        };
      };
    };
    let lastClaimDay = lastClaim / dayLengthNanos;
    let currentDay = Time.now() / dayLengthNanos;
    currentDay > lastClaimDay;
  };

  func generateRandomSeed(userId : UserId, timestamp : Timestamp) : Nat {
    let principalBytes = userId.toBlob().toArray();
    let principalBytesSum = principalBytes.foldLeft(0, func(acc, byte) { acc + byte.toNat() });
    timestamp.toNat() + principalBytesSum;
  };

  func selectRandomMysteryItem(randomSeed : Nat) : ?MysteryItem {
    let itemsArray = mysteryItems.toArray();
    let itemCount = itemsArray.size();

    if (itemCount == 0) { return null };

    let index = randomSeed % itemCount;
    let (_, item) = itemsArray[index];
    ?item;
  };

  func processMysteryItemReward(userId : UserId, mysteryItem : MysteryItem) : async () {
    switch (mysteryItem.pointsReward) {
      case (null) { () };
      case (?points) { await updatePointsBalance(userId, points) };
    };
  };

  public shared ({ caller }) func sendDirectMessage(receiver : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let senderId = caller;
    let newDirectMessage : DirectMessage = {
      id = directMessageIdCounter;
      sender = senderId;
      receiver;
      content;
      timestamp = Time.now();
    };

    // Increment the ID after assignment
    directMessageIdCounter += 1;

    directMessages.add(newDirectMessage);
  };

  public query ({ caller }) func getDirectMessages(otherUser : Principal) : async [DirectMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    // Authorization: Only the two participants can access their conversation
    let callerMessages = directMessages.values().filter(
      func(message) { 
        (message.sender == caller and message.receiver == otherUser) or 
        (message.sender == otherUser and message.receiver == caller) 
      }
    );
    
    callerMessages.toArray();
  };

  // Returns list of unique conversation partners ordered by most recent message
  public query ({ caller }) func getDirectMessagePartners() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversation partners");
    };

    // Build a map of partners with their most recent message timestamp
    let partnerMap = Map.empty<Principal, Timestamp>();

    for (message in directMessages.values()) {
      if (message.sender == caller) {
        let currentTimestamp = switch (partnerMap.get(message.receiver)) {
          case (null) { message.timestamp };
          case (?existingTimestamp) {
            if (message.timestamp > existingTimestamp) {
              message.timestamp;
            } else {
              existingTimestamp;
            };
          };
        };
        partnerMap.add(message.receiver, currentTimestamp);
      };

      if (message.receiver == caller) {
        let currentTimestamp = switch (partnerMap.get(message.sender)) {
          case (null) { message.timestamp };
          case (?existingTimestamp) {
            if (message.timestamp > existingTimestamp) {
              message.timestamp;
            } else {
              existingTimestamp;
            };
          };
        };
        partnerMap.add(message.sender, currentTimestamp);
      };
    };

    // Convert to array and sort by most recent timestamp
    let partnersArray = partnerMap.toArray();
    let sortedPartners = partnersArray.sort(
      func(a : (Principal, Timestamp), b : (Principal, Timestamp)) : { #less; #equal; #greater } {
        let (_, timestampA) = a;
        let (_, timestampB) = b;
        if (timestampA > timestampB) { #less }
        else if (timestampA < timestampB) { #greater }
        else { #equal }
      }
    );

    sortedPartners.map(func(entry : (Principal, Timestamp)) : Principal {
      let (partner, _) = entry;
      partner
    });
  };

  // Search Engine Store experience implementation
  public query func getAvailableSearchEngines() : async [SearchEngine] {
    // No authorization - allow guests to browse search engines
    availableSearchEngines.values().toArray();
  };

  public shared ({ caller }) func setDefaultSearchEngine(searchEngineId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set default search engine");
    };

    switch (availableSearchEngines.get(searchEngineId)) {
      case (null) { Runtime.trap("Search engine not found") };
      case (?_) {
        switch (userSearchPreferences.get(caller)) {
          case (null) {
            let newPrefs = {
              defaultSearchEngine = searchEngineId;
              searchHistory = List.empty<SearchHistoryEntry>();
            };
            userSearchPreferences.add(caller, newPrefs);
          };
          case (?existingPrefs) {
            let updatedPrefs = {
              existingPrefs with
              defaultSearchEngine = searchEngineId;
            };
            userSearchPreferences.add(caller, updatedPrefs);
          };
        };
      };
    };
  };

  public query ({ caller }) func getDefaultSearchEngine() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get default search engine");
    };

    switch (userSearchPreferences.get(caller)) {
      case (null) {
        // Return the first search engine as default if none set
        let engines = availableSearchEngines.toArray();
        if (engines.size() > 0) {
          let (firstId, _) = engines[0];
          firstId;
        } else { "" };
      };
      case (?prefs) { prefs.defaultSearchEngine };
    };
  };

  public shared ({ caller }) func recordSearchHistory(searchTerm : Text, searchEngineId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record search history");
    };

    let entry : SearchHistoryEntry = {
      userId = caller;
      searchTerm;
      searchType = searchEngineId;
      timestamp = Time.now();
    };

    // Add the entry to the global search history list
    searchHistory.add(entry);

    // Add the entry to the user's search preferences (keep last 20 entries)
    switch (userSearchPreferences.get(caller)) {
      case (null) {
        let newPrefs = {
          defaultSearchEngine = searchEngineId;
          searchHistory = List.fromArray<SearchHistoryEntry>([entry]);
        };
        userSearchPreferences.add(caller, newPrefs);
      };
      case (?existingPrefs) {
        let currentHistory = existingPrefs.searchHistory.toArray();
        let newHistoryArray = [entry].concat(if (currentHistory.size() > 19) { currentHistory.sliceToArray(0, 19) } else { currentHistory });
        let newHistoryList = List.fromArray<SearchHistoryEntry>(newHistoryArray);
        let updatedPrefs = {
          existingPrefs with
          searchHistory = newHistoryList;
        };
        userSearchPreferences.add(caller, updatedPrefs);
      };
    };
  };

  public query ({ caller }) func getSearchHistory() : async [SearchHistoryEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view search history");
    };

    switch (userSearchPreferences.get(caller)) {
      case (null) { [] };
      case (?prefs) { prefs.searchHistory.toArray() };
    };
  };

  // Group Management
  public shared ({ caller }) func createGroup(name : Text, description : Text) : async GroupId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create groups");
    };

    let groupId = caller.toText() # "_" # Time.now().toText();
    let newGroup : Group = {
      id = groupId;
      name;
      description;
      createdBy = caller;
      members = [caller];
      createdAt = Time.now();
    };

    groups.add(groupId, newGroup);
    groupMessages.add(groupId, List.empty<GroupMessage>());
    groupMessageCounter.add(groupId, 0);

    groupId;
  };

  public shared ({ caller }) func addGroupMember(groupId : GroupId, userId : UserId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add group members");
    };

    switch (groups.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?group) {
        // Only group creator or existing members can add new members
        if (group.createdBy != caller and not isGroupMember(groupId, caller)) {
          Runtime.trap("Unauthorized: Only group creator or members can add new members");
        };

        // Check if user is already a member
        if (isGroupMember(groupId, userId)) {
          Runtime.trap("User is already a member of this group");
        };

        let updatedGroup = {
          group with
          members = group.members.concat([userId]);
        };
        groups.add(groupId, updatedGroup);
      };
    };
  };

  public shared ({ caller }) func sendGroupMessage(groupId : GroupId, content : Text, mediaAttachment : ?MediaAttachment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send group messages");
    };

    // Verify caller is a group member
    if (not isGroupMember(groupId, caller)) {
      Runtime.trap("Unauthorized: Only group members can send messages");
    };

    let messageId = switch (groupMessageCounter.get(groupId)) {
      case (null) { 0 };
      case (?count) { count };
    };

    let newMessage : GroupMessage = {
      id = groupId # "_" # messageId.toText();
      groupId;
      sender = caller;
      content;
      mediaAttachment;
      timestamp = Time.now();
    };

    // Add message to group's message list
    switch (groupMessages.get(groupId)) {
      case (null) {
        groupMessages.add(groupId, List.fromArray<GroupMessage>([newMessage]));
      };
      case (?existingMessages) {
        existingMessages.add(newMessage);
      };
    };

    groupMessageCounter.add(groupId, messageId + 1);
  };

  public query ({ caller }) func getGroupMessages(groupId : GroupId) : async [GroupMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view group messages");
    };

    // Verify caller is a group member
    if (not isGroupMember(groupId, caller)) {
      Runtime.trap("Unauthorized: Only group members can view messages");
    };

    switch (groupMessages.get(groupId)) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  public query ({ caller }) func getGroup(groupId : GroupId) : async ?Group {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view groups");
    };

    // Verify caller is a group member
    if (not isGroupMember(groupId, caller)) {
      Runtime.trap("Unauthorized: Only group members can view group details");
    };

    groups.get(groupId);
  };

  public query ({ caller }) func getUserGroups() : async [Group] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their groups");
    };

    let userGroups = groups.values().filter(
      func(group) {
        group.members.find(func(m) { m == caller }) != null;
      }
    );

    userGroups.toArray();
  };

  // User Profile Operations
  public shared ({ caller }) func createProfile(username : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let existing = profiles.get(caller);
    if (existing != null) { Runtime.trap("Profile already exists") };
    if (username.isEmpty()) { Runtime.trap("Username cannot be empty") };

    let newProfile : UserProfile = {
      username;
      bio;
      profilePicture = { url = ""; contentType = "" };
      followers = [];
      following = [];
      status = "";
      points = 0;
      createdAt = Time.now();
      updatedAt = Time.now();
      lastDailyRewardClaim = null;
      rewardsClaimed = 0;
      dailyLoginStreak = 0;
      publishedAppsCount = 0;
      badges = [
        { name = "Registered"; description = "Registered as a user"; earnedAt = Time.now(); typeId = 0 },
      ];
      isPremiumMember = false;
      premiumExpiresAt = null;
      freeTrialStartTime = null;
      freeTrialExpiresAt = null;
      lastOnline = Time.now();
      musicUploads = [];
    };

    profiles.add(caller, newProfile);
  };

  public shared ({ caller }) func upgradeToPremium(months : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade to premium");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let now = Time.now();
        let expirationTime = switch (profile.premiumExpiresAt) {
          case (null) { now + months * 30 * 24 * 60 * 60 * 1000000000 };
          case (?expiresAt) { expiresAt + months * 30 * 24 * 60 * 60 * 1000000000 };
        };

        let updatedProfile = {
          profile with
          isPremiumMember = true;
          premiumExpiresAt = ?expirationTime;
          updatedAt = now;
          lastOnline = now;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func activateFreeTrial() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can activate free trial");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let now = Time.now();
        let trialPeriodNanos = 3 * 24 * 60 * 60 * 1000000000;

        if (profile.freeTrialStartTime != null) {
          Runtime.trap("Free trial already activated");
        };

        let updatedProfile = {
          profile with
          freeTrialStartTime = ?now;
          freeTrialExpiresAt = ?(now + trialPeriodNanos);
          updatedAt = now;
          lastOnline = now;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateProfile(bio : Text, profilePicture : { url : Text; contentType : Text }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?existingProfile) {
        let updatedProfile = {
          existingProfile with
          bio;
          profilePicture;
          updatedAt = Time.now();
          lastOnline = Time.now();
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query func getProfile(userId : UserId) : async UserProfile {
    // Public access - anyone can view profiles (including guests)
    switch (profiles.get(userId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their own profile");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    profiles.values().toArray();
  };

  public query func searchProfiles(searchTerm : Text) : async [SearchResult] {
    // Public access - allow guests to search profiles for discovery
    let searchTermLower = searchTerm.toLower();
    let filtered = profiles.entries().filter(
      func((_, p)) {
        p.username.toLower().contains(#text searchTermLower);
      }
    );

    filtered.toArray().map(func((userId, p)) { 
      {
        userId;
        username = p.username;
        bio = p.bio;
        profilePicture = p.profilePicture;
        followerCount = getAllFollowersCount(profiles, userId);
        followingCount = p.following.size();
      }
    });
  };

  public shared ({ caller }) func updateLastOnline() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update last online timestamp");
    };

    switch (profiles.get(caller)) {
      case (null) { () };
      case (?profile) {
        let updatedProfile = {
          profile with
          lastOnline = Time.now();
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getLastOnline(userId : UserId) : async Timestamp {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view last online status");
    };

    let userProfile = profiles.get(userId);
    switch (userProfile) {
      case (null) { 0 };
      case (?profile) { profile.lastOnline };
    };
  };

  public query ({ caller }) func getLastOnlineForMultipleUsers(userIds : [UserId]) : async [(UserId, Timestamp)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view last online status");
    };

    let results = List.empty<(UserId, Timestamp)>();
    for (userId in userIds.values()) {
      let lastOnline = switch (profiles.get(userId)) {
        case (null) { 0 };
        case (?profile) { profile.lastOnline };
      };
      results.add((userId, lastOnline));
    };
    results.toArray();
  };

  public query func getRecentStatuses(limit : Nat) : async [FeedItem] {
    // Public access - allow guests to view recent statuses for discovery
    let resultList = List.empty<FeedItem>();
    for ((userId, profile) in profiles.entries()) {
      resultList.add({
        userId;
        username = profile.username;
        status = profile.status;
        timestamp = profile.lastOnline;
      });
    };

    let resultArray = resultList.toArray();
    let sortedArray = resultArray.sort(
      func(a, b) {
        if (a.timestamp < b.timestamp) { return #greater };
        if (a.timestamp > b.timestamp) { return #less };
        #equal;
      }
    );

    let resultLength = if (sortedArray.size() < limit) { sortedArray.size() } else { limit };
    sortedArray.sliceToArray(0, resultLength);
  };

  public shared ({ caller }) func claimDailyReward() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim daily rewards");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let currentTime = Time.now();
        if (not canClaimDailyReward(profile, currentTime)) {
          Runtime.trap("Daily reward already claimed for today");
        };

        let dailyStreak = getDailyLoginStreak(profile, currentTime);
        let badges = profile.badges;

        if (not hasEarnedBadge(profile, "dailyRewards")) {
          let rewardsBadge = { name = "dailyRewards"; description = "Logged in and claimed daily rewards all week"; earnedAt = currentTime; typeId = 1 };
          let newBadges = badges.concat([rewardsBadge]);
          let updatedProfile = {
            profile with
            points = profile.points + 10;
            lastDailyRewardClaim = ?currentTime;
            rewardsClaimed = profile.rewardsClaimed + 1;
            dailyLoginStreak = dailyStreak;
            badges = newBadges;
            updatedAt = currentTime;
          };
          profiles.add(caller, updatedProfile);
        } else {
          let updatedProfile = {
            profile with
            points = profile.points + 10;
            lastDailyRewardClaim = ?currentTime;
            rewardsClaimed = profile.rewardsClaimed + 1;
            dailyLoginStreak = dailyStreak;
            updatedAt = currentTime;
          };
          profiles.add(caller, updatedProfile);
        };
        let rewardId = caller.toText() # "_" # currentTime.toText();
        let dailyReward = {
          id = rewardId;
          userId = caller;
          points = 10;
          timestamp = currentTime;
          claimed = true;
        };
        dailyRewards.add(rewardId, dailyReward);
        await recordTransaction(caller, 10, #earn, "Daily reward claimed");
        "Reward claimed successfully";
      };
    };
  };

  public shared ({ caller }) func purchasePoints(pointsToBuy : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase points");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedProfile = {
          profile with
          points = profile.points + pointsToBuy;
          updatedAt = Time.now();
        };
        profiles.add(caller, updatedProfile);
        await recordTransaction(caller, pointsToBuy.toInt(), #purchase, "Points purchased (Stripe coming soon)");
        "Points purchased successfully";
      };
    };
  };

  public shared ({ caller }) func spendPoints(amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can spend points");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (amount > profile.points) { Runtime.trap("Insufficient points") };
        let updatedProfile = {
          profile with
          points = profile.points - amount;
          updatedAt = Time.now();
        };
        profiles.add(caller, updatedProfile);
        await recordTransaction(caller, -amount.toInt(), #spend, "Points spent");
        "Points spent successfully";
      };
    };
  };

  public query ({ caller }) func getPointsBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points balance");
    };

    switch (profiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.points };
    };
  };

  public query ({ caller }) func getPointsHistory() : async [PointsTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points history");
    };

    let filtered = transactions.values().filter(
      func(t) { t.userId == caller }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func addStoreItem(item : PointsStoreItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add store items");
    };
    pointsStore.add(item.id, item);
  };

  public shared ({ caller }) func updateStoreItem(id : Text, name : Text, description : Text, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update store items");
    };

    switch (pointsStore.get(id)) {
      case (null) { Runtime.trap("Store item not found") };
      case (?existingItem) {
        let newItem = {
          existingItem with
          name;
          description;
          price;
        };
        pointsStore.add(id, newItem);
      };
    };
  };

  public shared ({ caller }) func deleteStoreItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete store items");
    };
    pointsStore.remove(id);
  };

  public shared ({ caller }) func purchaseStoreItem(storeItemId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase store items");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        switch (pointsStore.get(storeItemId)) {
          case (null) { Runtime.trap("Store item not found") };
          case (?storeItem) {
            if (storeItem.price > profile.points) { 
              Runtime.trap("Insufficient points to purchase item") 
            };

            let updatedProfile = {
              profile with
              points = profile.points - storeItem.price;
              updatedAt = Time.now();
            };
            profiles.add(caller, updatedProfile);

            await recordTransaction(caller, -storeItem.price.toInt(), #spend, "Purchased: " # storeItem.name);
            "Congratulations! You have redeemed a store item!";
          };
        };
      };
    };
  };

  public query func getStoreItems() : async [PointsStoreItem] {
    // No authorization required - allow guests to browse store items to encourage sign-ups
    pointsStore.values().toArray();
  };

  public query ({ caller }) func checkPointsEligibility(requiredPoints : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check points eligibility");
    };

    switch (profiles.get(caller)) {
      case (null) { "Profile not found" };
      case (?profile) {
        if (requiredPoints > profile.points) {
          let difference = (requiredPoints - profile.points).toInt();
          if (difference < 0) {
            Runtime.trap("Insufficient points to purchase item");
          };
          difference.toText();
        } else { "Eligible" };
      };
    };
  };

  public shared ({ caller }) func uploadMusic(id : Text, title : Text, artist : Text, genre : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload music");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let music : MusicUpload = {
          id;
          title;
          artist;
          genre;
          file;
          uploadedBy = caller;
          uploadTime = Time.now();
        };

        // Store music in global musicUploads map
        musicUploads.add(id, music);

        // Add music to user's musicUploads array in profile
        let updatedProfile = {
          profile with
          musicUploads = profile.musicUploads.concat([music]);
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getFriendsMusicUploads(userId : UserId) : async [MusicUpload] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view friends' music");
    };

    // Users can only view their own friends' music or the target user must be the caller
    if (caller != userId) {
      Runtime.trap("Unauthorized: Can only view your own friends' music");
    };

    // Fetch the user's profile to get their friends
    let userProfile = profiles.get(userId);
    if (userProfile == null) { return [] };

    let profile = switch (userProfile) {
      case (null) { return [] };
      case (?p) { p };
    };

    // Collect music uploads from all friends in a single pass
    let resultList = List.empty<MusicUpload>();

    for (friendId in profile.following.values()) {
      switch (profiles.get(friendId)) {
        case (?friendProfile) {
          for (music in friendProfile.musicUploads.values()) {
            resultList.add(music);
          };
        };
        case (null) {};
      };
    };

    resultList.toArray();
  };

  // Daily Items Secret management
  public shared ({ caller }) func claimDailyItemsSecret() : async ?MysteryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim daily items secret");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?_) {
        if (not canClaimDailySecret(caller)) { 
          return await getLastClaimedMysteryItem(caller) 
        };

        let randomSeed = generateRandomSeed(caller, Time.now());
        switch (selectRandomMysteryItem(randomSeed)) {
          case (null) { return null };
          case (?mysteryItem) {
            await processMysteryItemReward(caller, mysteryItem);

            let claimId = caller.toText() # "_" # Time.now().toText();
            let claimData = {
              id = claimId;
              userId = caller;
              dailyItemBoxOpened = true;
              newDailyItemResult = ?mysteryItem;
              lastDailyItemClaim = ?Time.now();
            };
            dailyItemsRewardHistory.add(claimId, claimData);
            dailyItemsLastReward.add(caller, mysteryItem);

            // Record transaction if points were awarded
            switch (mysteryItem.pointsReward) {
              case (null) { () };
              case (?points) {
                await recordTransaction(caller, points, #earn, "Daily Items Secret: " # mysteryItem.name);
              };
            };

            ?mysteryItem;
          };
        };
      };
    };
  };

  public query ({ caller }) func getLastClaimedMysteryItem(userId : UserId) : async ?MysteryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view mystery items");
    };

    // Users can only view their own last claimed item, admins can view any user's
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own mystery items");
    };

    dailyItemsLastReward.get(userId);
  };

  public query func getAllMysteryItems() : async [MysteryItem] {
    // No authorization required - allow guests to browse mystery items to encourage sign-ups
    mysteryItems.values().toArray();
  };

  public query ({ caller }) func getUserMysteryItems(userId : UserId) : async [DailyMysteryItemData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view mystery item history");
    };

    // Users can only view their own history, admins can view any user's history
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own mystery item history");
    };

    let filteredClaims = dailyItemsRewardHistory.values().filter(
      func(claim) { claim.userId == userId }
    );
    filteredClaims.toArray();
  };

  public shared ({ caller }) func addMysteryItem(mysteryItem : MysteryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add mystery items");
    };
    mysteryItems.add(mysteryItem.id, mysteryItem);
  };

  public shared ({ caller }) func updateMysteryItem(id : Text, name : Text, description : Text, pointsReward : ?Nat, visualUrl : ?Text, rewardCooldown : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update mystery items");
    };

    switch (mysteryItems.get(id)) {
      case (null) { Runtime.trap("Mystery item not found") };
      case (?existingItem) {
        let newItem = {
          existingItem with
          name;
          description;
          pointsReward;
          visualUrl;
          rewardCooldown;
        };
        mysteryItems.add(id, newItem);
      };
    };
  };

  public shared ({ caller }) func deleteMysteryItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete mystery items");
    };
    mysteryItems.remove(id);
  };

  public query ({ caller }) func isMysteryItemClaimAvailable(userId : UserId) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check claim availability");
    };

    // Users can only check their own claim availability, admins can check any user's
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own claim availability");
    };

    canClaimDailySecret(userId);
  };
};
