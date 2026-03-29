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

  public type MembershipTier = {
    #free;
    #pro;
    #ultra;
    #ultimate;
  };

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
    membershipTier : MembershipTier;
  };

  public type Badge = {
    name : Text;
    description : Text;
    earnedAt : Timestamp;
    typeId : Nat;
  };

  // Message styling types
  public type MessageColor = {
    #normal;
    #black;
    #orange;
    #cyan;
    #purple;
    #blue;
  };

  public type MessageEffect = {
    #none;
    #spooky;
    #fiery;
    #devil;
    #skull;
    #animated;
    #dodge;
  };

  public type Message = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : MessageColor;
    effect : MessageEffect;
  };

  public type DirectMessage = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : MessageColor;
    effect : MessageEffect;
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
    color : MessageColor;
    effect : MessageEffect;
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
  var profiles = Map.empty<UserId, UserProfile>();
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

  func getUserMembershipTier(userId : UserId) : MembershipTier {
    switch (profiles.get(userId)) {
      case (null) { #free };
      case (?profile) { profile.membershipTier };
    };
  };

  func isColorAllowedForTier(tier : MembershipTier, color : MessageColor) : Bool {
    switch (tier) {
      case (#free) {
        switch (color) {
          case (#normal) { true };
          case (_) { false };
        };
      };
      case (#pro) {
        switch (color) {
          case (#normal or #black or #orange or #blue or #purple) { true };
          case (_) { false };
        };
      };
      case (#ultra) {
        switch (color) {
          case (#normal or #black or #orange or #blue or #purple) { true };
          case (_) { false };
        };
      };
      case (#ultimate) {
        switch (color) {
          case (#normal or #black or #orange or #blue or #purple) { true };
          case (_) { false };
        };
      };
    };
  };

  func isEffectAllowedForTier(tier : MembershipTier, effect : MessageEffect) : Bool {
    switch (tier) {
      case (#free) {
        switch (effect) {
          case (#none) { true };
          case (_) { false };
        };
      };
      case (#pro) {
        switch (effect) {
          case (#none) { true };
          case (_) { false };
        };
      };
      case (#ultra) {
        switch (effect) {
          case (#none or #skull or #fiery) { true };
          case (_) { false };
        };
      };
      case (#ultimate) {
        switch (effect) {
          case (#none or #skull or #fiery or #dodge) { true };
          case (_) { false };
        };
      };
    };
  };

  func validateMessageStyling(userId : UserId, color : MessageColor, effect : MessageEffect) : Bool {
    let tier = getUserMembershipTier(userId);
    isColorAllowedForTier(tier, color) and isEffectAllowedForTier(tier, effect);
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

  public shared ({ caller }) func sendGroupMessage(
    groupId : GroupId,
    content : Text,
    mediaAttachment : ?MediaAttachment,
    color : MessageColor,
    effect : MessageEffect,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send group messages");
    };

    // Verify caller is a group member
    if (not isGroupMember(groupId, caller)) {
      Runtime.trap("Unauthorized: Only group members can send messages");
    };

    // Validate message styling based on membership tier
    if (not validateMessageStyling(caller, color, effect)) {
      Runtime.trap("Unauthorized: Your membership tier does not allow this message styling");
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
      color;
      effect;
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

  // Overloaded function to support legacy group messages (without style) for backwards compatibility.
  public shared ({ caller }) func sendGroupMessageLegacy(groupId : GroupId, content : Text, mediaAttachment : ?MediaAttachment) : async () {
    await sendGroupMessage(groupId, content, mediaAttachment, #normal, #none);
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

  public shared ({ caller }) func setMembershipTier(userId : UserId, tier : MembershipTier) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can change membership tiers");
    };

    switch (profiles.get(userId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedProfile = {
          profile with
          membershipTier = tier;
        };
        profiles.add(userId, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMembershipTier(userId : UserId) : async MembershipTier {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view membership tiers");
    };

    getUserMembershipTier(userId);
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };
};
