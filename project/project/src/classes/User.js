class User {
    constructor(email, fullName, location, bio, profilePic)
    {
        this.email = email; //string
        this.fullName = fullName; //string

        this.location = location; //string
        this.bio = bio; //string
        this.profilePic = profilePic; //img

        this.eventPlannerInfo = null; //EventPlanner
        this.performerInfo = []; //Performer[]
        this.groupMemberships = []; //Group[]
        this.friendEmails = []; //string[]
        this.reviews = []; //Review[]

        this.isPerformer = false; //bool
        this.isEventPlanner = false; //bool
        this.isInGroup = false; //bool
    }

    editBio(newBio)
    {
        this.bio = newBio;
    }
    editLocation(newLocation)
    {
        this.location = newLocation;
    }
    editProfilePic(newProfilePic)
    {
        this.profilePic = newProfilePic;
    }
    addFriend(userEmail)
    {
        this.friendEmails.push(userEmail);
    }
    addPerformanceInfo(performerDetails)
    {
        this.performerInfo.push(performerDetails);
        this.isPerformer = true;
    }
    addEventPlanner(eventPlanningDetails)
    {
        this.eventPlannerDetails = eventPlanningDetails;
        this.isEventPlanner = true;
    }
    addGroupMembership(group)
    {
        this.groupMemberships.push(group);
        this.isInGroup = true;
    }
    addReview(review)
    {
        for (let i = 0; i < this.reviews.length; i++)
        {
            if (this.reviews.user === review.user)
            {
                return false;
            }
        }
        this.reviews.push(review);
        return true;
    }

    //ADD FUNCTIONALITY FOR REMOVAL OF PERFORMER/EVENT PLANNER/GROUP MEMBERSHIP DETAILS. ENSURE THEY UPDATE THE BOOLEAN INDICATORS IF NECESSARY
}

export default User;