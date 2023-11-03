import Slot from "../classes/Slot";

class Event {
    constructor(creatingUserEmail, eventName, eventType, dates, venue, eventDescription, genres)
    {
        this.eventName = eventName; //string
        this.eventType = eventType; //string
        this.eventDates = dates; //Date[]
        this.eventVenue = venue; //string
        this.eventDescription = eventDescription; //string
        this.genres = genres; //string
        
        this.eventPlannerEmails = [creatingUserEmail]; //string
        this.performerEmails = []; //string
        this.slots = [];
        this.links = []; //string[]
        this.media = []; //[]
    }

    addGenre(genre)
    {
        for (let i = 0; i < this.genres.length; i++)
        {
            if (this.genres[i] === genre)
            {
                return false;
            }
        }
        this.genres.push(genre);
        return true;
    }
    addSlot(creatingUserEmail, eventName, startDate, endDate, stageDetails, genres, description)
    {
        let newSlot = new Slot(creatingUserEmail, eventName, startDate, endDate, stageDetails, genres, description);
        //check it doesn't conflict with other slots
        this.slots.push(newSlot);
    }
    addEventPlanner(planner)
    {
        for (let i = 0; i < this.eventPlannerEmails.length; i++)
        {
            if (this.eventPlannerEmails[i] === planner)
            {
                return false;
            }
        }
        this.eventPlannerEmails.push(planner);
        return true;
    }
    addPerformer(performer)
    {
        for (let i = 0; i < this.performerEmails.length; i++)
        {
            if (this.performerEmails[i] === performer)
            {
                return false;
            }
        }
        this.performerEmails.push(performer);
        return true;
    }
    addLink(link)
    {
        for (let i = 0; i < this.links.length; i++)
        {
            if (this.links[i] === link)
            {
                return false;
            }
        }
        this.links.push(link);
        return true;
    }
    addMedia(mediaItem)
    {
        if (this.media.length > 5)
        {
            return false;
        }
        this.media.push(mediaItem);
        return true;
    }
    getEndDate() 
    {
        let latestDate = this.eventDates[0];
        for (let i = 0; i < this.eventDates.length; i++)
        {
            if (this.eventDates[i] > latestDate)
            {
                latestDate = this.eventDates[i];
            }
        }
        return latestDate;
    }
}

export default Event;