class Performer {
    constructor(rootUserEmail, type, genres, equipment, hourlyRate)
    {
        this.userEmail = rootUserEmail; //string
        this.type = type; //string

        this.genres = genres; //string[]
        this.equipment = equipment; //string[]
        this.hourlyRate = hourlyRate; //float

        this.pastEvents = []; //Event[]
        this.upcomingEvents = []; //Event[]
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
    addEquipmentItem(item)
    {
        for (let i = 0; i < this.equipment.length; i++)
        {
            if (this.equipment[i] === item)
            {
                return false;
            }
        }
        this.equipment.push(item);
        return true;
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
    changeHourlyRate(newRate)
    {
        this.hourlyRate = newRate;
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

    //TO-DO: ADD NECESSARY REMOVAL FUNCTIONALITY, ESPECIALLY FOR MEDIA. POSSIBLY LIMIT THE NUMBER OF LINKS TO LIKE 8 LINKS - insta, x, threads, facebook, youtube, soundcloud, mixcloud, website
}

export default Performer;