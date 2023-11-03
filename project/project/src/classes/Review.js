class Review {
    constructor(reviewingUserEmail, rating, comment) 
    {
        this.userEmail = reviewingUserEmail; //User
        this.rating = rating; //int between 1 and 10
        this.comment = comment; //string
    }
}

export default Review;