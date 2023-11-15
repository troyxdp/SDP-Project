import styled from "styled-components";

const DetailsContainer = styled.div`
    padding: 10px;
    margin-top: 8px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #444;
    border-radius: 10px;
    width: 95%;
`;
const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Detail = styled.text`
  padding: 0px;
  margin-bottom: 0px;
  font-size: 1rem;
  justify-content: center;
`;

export function ReviewDisplay({review}) {
    const score = review.score;
    const reviewerEmail = review.reviewerEmail;
    const comment = review.comment;

    return(
        <>
            <DetailsContainer>
                <DetailsBox>
                    <Detail><b>Score:</b> {score}/10</Detail>
                    <Detail>{comment}</Detail>
                    <Detail><b>From:</b> {reviewerEmail}</Detail>
                </DetailsBox>
            </DetailsContainer>
        </>
    )
}