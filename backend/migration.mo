import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Blob "mo:core/Blob";

module {
  type UserId = Principal;
  type MessageId = Nat;
  type GroupId = Text;
  type Timestamp = Int;

  // Legacy types (from previous canister state)
  type LegacyMessageColor = {
    #normal;
    #black;
    #orange;
    #cyan;
  };

  type LegacyMessage = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : LegacyMessageColor;
    effect : LegacyMessageEffect;
  };

  type LegacyDirectMessage = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : LegacyMessageColor;
    effect : LegacyMessageEffect;
  };

  type LegacyGroupMessage = {
    id : Text;
    groupId : GroupId;
    sender : UserId;
    content : Text;
    mediaAttachment : ?MediaAttachment;
    timestamp : Timestamp;
    color : LegacyMessageColor;
    effect : LegacyMessageEffect;
  };

  type LegacyUserProfile = {
    username : Text;
    bio : Text;
    profilePicture : { url : Text; contentType : Text };
    followers : [UserId];
    following : [UserId];
    status : Text;
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

  // Current types (new canister state)
  type MessageColor = {
    #normal;
    #black;
    #orange;
    #cyan;
    #purple;
    #blue;
  };

  type MessageEffect = {
    #none;
    #spooky;
    #fiery;
    #devil;
    #skull;
    #animated;
    #dodge;
  };

  type LegacyMessageEffect = {
    #none;
    #spooky;
    #fiery;
    #devil;
    #skull;
    #animated;
  };

  type Message = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : MessageColor;
    effect : MessageEffect;
  };

  type DirectMessage = {
    id : MessageId;
    sender : UserId;
    receiver : UserId;
    content : Text;
    timestamp : Timestamp;
    color : MessageColor;
    effect : MessageEffect;
  };

  type GroupMessage = {
    id : Text;
    groupId : GroupId;
    sender : UserId;
    content : Text;
    mediaAttachment : ?MediaAttachment;
    timestamp : Timestamp;
    color : MessageColor;
    effect : MessageEffect;
  };

  type UserProfile = {
    username : Text;
    bio : Text;
    profilePicture : { url : Text; contentType : Text };
    followers : [UserId];
    following : [UserId];
    status : Text;
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

  type Badge = {
    name : Text;
    description : Text;
    earnedAt : Timestamp;
    typeId : Nat;
  };

  type MediaAttachment = {
    url : Text;
    contentType : Text;
    mediaType : { #image; #video; #audio };
  };

  type MusicUpload = {
    id : Text;
    title : Text;
    artist : Text;
    genre : Text;
    file : Blob;
    uploadedBy : UserId;
    uploadTime : Timestamp;
  };

  type MembershipTier = {
    #free;
    #pro;
    #ultra;
    #ultimate;
  };

  func convertToCurrentMessageColor(legacyColor : LegacyMessageColor) : MessageColor {
    switch (legacyColor) {
      case (#normal) { #normal };
      case (#black) { #black };
      case (#orange) { #orange };
      case (#cyan) { #cyan };
    };
  };

  func convertToCurrentMessageEffect(legacyEffect : LegacyMessageEffect) : MessageEffect {
    switch (legacyEffect) {
      case (#none) { #none };
      case (#spooky) { #spooky };
      case (#fiery) { #fiery };
      case (#devil) { #devil };
      case (#skull) { #skull };
      case (#animated) { #animated };
    };
  };

  type LegacyState = {
    profiles : Map.Map<Principal, LegacyUserProfile>;
    messages : Map.Map<MessageId, LegacyMessage>;
    groupMessages : Map.Map<GroupId, List.List<LegacyGroupMessage>>;
    directMessages : List.List<LegacyDirectMessage>;
  };

  type CurrentState = {
    profiles : Map.Map<Principal, UserProfile>;
    messages : Map.Map<MessageId, Message>;
    groupMessages : Map.Map<GroupId, List.List<GroupMessage>>;
    directMessages : List.List<DirectMessage>;
  };

  public func run(legacy : LegacyState) : CurrentState {
    let currentUserProfiles = legacy.profiles.map<Principal, LegacyUserProfile, UserProfile>(
      func(_, legacyProfile) {
        { legacyProfile with membershipTier = #free };
      }
    );

    let currentMessages = legacy.messages.map<MessageId, LegacyMessage, Message>(
      func(_, legacyMessage) {
        {
          legacyMessage with
          color = convertToCurrentMessageColor(legacyMessage.color);
          effect = convertToCurrentMessageEffect(legacyMessage.effect);
        };
      }
    );

    let currentGroupMessages = legacy.groupMessages.map<GroupId, List.List<LegacyGroupMessage>, List.List<GroupMessage>>(
      func(_, legacyGroupMessages) {
        legacyGroupMessages.map<LegacyGroupMessage, GroupMessage>(
          func(legacyGroupMessage) {
            {
              legacyGroupMessage with
              color = convertToCurrentMessageColor(legacyGroupMessage.color);
              effect = convertToCurrentMessageEffect(legacyGroupMessage.effect);
            };
          }
        );
      }
    );

    let currentDirectMessages = legacy.directMessages.map<LegacyDirectMessage, DirectMessage>(
      func(legacyDirectMessage) {
        {
          legacyDirectMessage with
          color = convertToCurrentMessageColor(legacyDirectMessage.color);
          effect = convertToCurrentMessageEffect(legacyDirectMessage.effect);
        };
      }
    );

    {
      profiles = currentUserProfiles;
      messages = currentMessages;
      groupMessages = currentGroupMessages;
      directMessages = currentDirectMessages;
    };
  };
};
