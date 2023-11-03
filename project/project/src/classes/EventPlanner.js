class EventPlanner {
    constructor(rootUserEmail, types)
    {
        this.userEmail = rootUserEmail; //string
        this.types = types; //string[]
        
        this.pastEvents = []; //Event[]
        this.upcomingEvents = []; //Event[]
        this.links = []; //string[]
        this.media = []; //[]
    }

    addPastEvent(event)
    {
        for (let i = 0; i < this.pastEvents.length; i++)
        {
            if (this.pastEvents[i] === event)
            {
                return false;
            }
        }
        this.pastEvents.push(event);
        return true;
    }
    addUpcomingEvent(event)
    {
        for (let i = 0; i < this.upcomingEvents.length; i++)
        {
            if (this.upcomingEvents[i] === event)
            {
                return false;
            }
        }
        this.upcomingEvents.push(event);
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
    addMedia(media)
    {
        if (this.media.length <= 5)
        {
            this.media.push(media);
            return true;
        }
        return false;
    }
    updatePastEvents()
    {
        let date = new Date();
        for (let i = 0; i < this.upcomingEvents.length; i++)
        {
            if (this.upcomingEvents[i].getEndDate() < date)
            {
                this.pastEvents.push(this.upcomingEvents[i]);
                this.upcomingEvents.splice(i, 1);
                i--;
            }
        }
    }

    //TO-DO: ADD REMOVAL FUNCTIONS
}

export default EventPlanner;