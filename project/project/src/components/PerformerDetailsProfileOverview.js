import styled from "styled-components";

const PerformerDetailsContainer = styled.div`
    padding: 5px;
    margin: 0px 0px 8px 0px;
    display: flex;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #333;
    border-radius: 5px;
`;
const Name = styled.h2`
  font-size: 1.2rem;
  color: #a13333;
  margin-top: 0px;
  margin-bottom: 0px;
`;
const StyledLabel = styled.label`
    font-size: 0.9rem;
    margin-bottom: 2px;
`;
const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;
const Detail = styled.text`
  padding: 1px;
  margin-bottom: 8px;
  font-size: 0.8rem;
  justify-content: center;
`;
const LinkBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-bottom: 8px;
`;
const StyledLink = styled.a`
  font-size: 0.8rem;
  color: #0000ff;
`;

export function PerformerDetailsProfileOverview({email, name, type, genres, links})
{
  //write the genres played out as a string for display using the genres array passed as a prop
  let performerGenres = "" + genres[0];
  for (let i = 1; i < genres.length; i++)
  {
    performerGenres += ", " + genres[i];
  }

  //create Link components using the links array passed as a prop
  const LinkDisplays = [];
  for (let i = 0; i < links.length; i++)
  {
    LinkDisplays.push(
      <StyledLink href={links[i]}>{links[i]}</StyledLink>
    );
  }
  
  return(
    <PerformerDetailsContainer>
      <Name>{name}</Name>
      <DetailsBox>
        <StyledLabel><b>Type of Performer:</b></StyledLabel>
        <Detail>{type}</Detail>
        <StyledLabel><b>Genres Played:</b></StyledLabel>
        <Detail>{performerGenres}</Detail>
        <StyledLabel><b>Links:</b></StyledLabel>
        {links.length > 0 &&
          <LinkBox>
            {LinkDisplays}
          </LinkBox>
        }
      </DetailsBox>
    </PerformerDetailsContainer>
  );
}