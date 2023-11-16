
import styled from "styled-components";
const GroupDetailsContainer = styled.div`
  padding: 0px;
  margin-bottom: 3px;
  display: flex;
  flex-direction: column;
  align-items: left;
  overflow-x: hidden;
  overflow-y: auto;
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

export function GroupDetailsProfileOverview({groupname,groupdescription,groupmembers,genres}) {
  let groupGenres = "" + genres[0];
  for (let i = 1; i < genres.length; i++)
  {
    groupGenres += ", " + genres[i];
  }

  //create Link components using the links array passed as a prop
  const LinkDisplays = [];
  for (let i = 0; i < groupmembers.length; i++)
  {
    LinkDisplays.push(
      <StyledLink href={groupmembers[i]}>{groupmembers[i]}</StyledLink>
    );
  }
    return(
        <GroupDetailsContainer>
          <Name>{groupname}</Name>
          <DetailsBox>
            <StyledLabel><b>groupDescription:</b></StyledLabel>
            <Detail>{groupdescription}</Detail>
            <StyledLabel><b>Genres Played:</b></StyledLabel>
            <Detail>{groupGenres}</Detail>
            <StyledLabel><b>Members:</b></StyledLabel>
            {groupmembers.length > 0 &&
          <LinkBox>
            {LinkDisplays}
          </LinkBox>
        }
          </DetailsBox>
        </GroupDetailsContainer>
      );
}