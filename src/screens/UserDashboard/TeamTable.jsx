import React, { useState, useContext } from "react";
import StarCanvas from "../landingPage/StarbackGround";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Typography, useMediaQuery } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { Modal } from "@mui/material";
import AuthContext from "../../components/Auth/Auth";
import { Verified } from "@mui/icons-material";
import { IoMdPersonAdd } from "react-icons/io";
import { Box, TextField } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../API/Api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "grey",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TeamTable({ teamMembers }) {
  const authContext = useContext(AuthContext);
  const [members, setMembers] = useState(teamMembers);
  console.log(members, "   type ==>", typeof members);
  const [addMember, setAddMember] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMemberEmail, setTeamMemberEmail] = useState("");
  const [fieldErr, setFieldErr] = useState(null);

  const navigate = useNavigate();

  async function registerTeamEvent() {
    if (authContext.isUserLoggedIn === false) {
      navigate("/sign-in");
    }

    const createTeam = async () => {
      await axios
        .post(
          `${baseUrl}/team/create`,
          {
            teamName: teamName,
            members: teamMemberEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${authContext.token}`,
            },
          }
        )
        .then((result) => {
          if (result.data.message === "team created") {
            Swal.fire({
              title: "Great!!",
              text: `Your team is succesfully created`,
              icon: "success",
              confirmButtonColor: "skyblue",
            });
          }
          console.log("result.data ==> ", result.data);
        });
    };

    const addTeam = async () => {
      await axios
        .post(
          `${baseUrl}/user/addevent`,
          {
            // eventId: `${eventId}`,
            type: "team",
          },
          {
            headers: {
              Authorization: `Bearer ${authContext.token}`,
            },
          }
        )
        .then((result) => {
          console.log("Result Data===>", result.data);
          Swal.fire({
            title: "Great!!",
            text: `${result.data.message}`,
            icon: "success",
            confirmButtonColor: "skyblue",
          });
          navigate(`/user`);
        });
    };

    createTeam();
    // addTeam();
  }

  const handleTeamDelete = (id) => {
    axios
      .post(
        `${baseUrl}/team/delete`,
        { id },
        {
          headers: {
            Authorization: "Bearer" + authContext.token,
          },
        }
      )
      .then((result) => {
        console.log("team delete result ==>", result);
      });
  };

  const isMobile = useMediaQuery("(max-width:450px)");
  return (
    <>
      {/* <StarCanvas /> */}
      <div
        className="Team"
        style={{
          width: "70%",
          position: "relative",
          zIndex: "30",
          // marginTop: "4.5rem",
          marginRight: "10%",
          marginLeft: "5%",
          overflowX: "scroll",
          overflowY: "scroll",
        }}
      >
        <Typography
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            marginTop: "4.5rem",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Team Table
        </Typography>
        <TableContainer>
          <Table
            sx={{
              midth: 200,
              width: isMobile ? 35 : 1000,
              margin: isMobile ? 1 : 20,
              marginLeft: isMobile ? 0 : 35,
            }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Team Name
                </StyledTableCell>
                <StyledTableCell align="right">
                  Members
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell align="right">Status</StyledTableCell>
                </StyledTableCell>
                <StyledTableCell align="right">Leader Name</StyledTableCell>
                <StyledTableCell align="right">Add Member</StyledTableCell>
                <StyledTableCell align="right">Delete Team</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members &&
                members.length > 0 &&
                Object.values(members).map((team) => {
                  return (
                    <StyledTableRow key={team._id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        style={{ background: "grey" }}
                      >
                        {team.teamName}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        style={{ background: "grey" }}
                      >
                        {team.eventName}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        style={{ background: "grey" }}
                      >
                        {team.members.map((eachMember) => {
                          return (
                            <>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                style={{ background: "grey" }}
                                key={eachMember.memberId}
                                className={
                                  eachMember.status ? "verified" : "notVerified"
                                }
                              >
                                <Typography style={{ color: "black" }}>
                                  {eachMember.email}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell>
                                {eachMember.status ? "verified" : "notVerified"}
                              </StyledTableCell>
                            </>
                          );
                        })}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        style={{ background: "grey" }}
                      >
                        {team.leaderName}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        style={{ background: "grey" }}
                      >
                        <Button
                          onClick={() => {
                            setAddMember(true);
                          }}
                        >
                          <IoMdPersonAdd color="white" />
                        </Button>
                      </StyledTableCell>
                      {addMember && (
                        <Modal
                          open={true}
                          onClose={() => {
                            setAddMember(false);
                          }}
                          aria-labelledby="child-modal-title"
                          aria-describedby="child-modal-description"
                        >
                          <Box sx={style}>
                            {fieldErr && (
                              <>
                                <Typography style={{ color: "red" }}>
                                  {fieldErr}
                                </Typography>
                              </>
                            )}
                            <TextField
                              id="standard-basic"
                              label="Member Email"
                              variant="standard"
                              sx={{ marginBottom: 2 }}
                              onChange={(e) => setTeamMemberEmail(e.target.value)}
                            />
                            <Button
                              variant="contained"
                              style={{
                                display: "flex",
                                marginLeft: "auto",
                              }}
                              onClick={registerTeamEvent}
                            >
                              OK
                            </Button>
                          </Box>
                        </Modal>
                      )}
                      <StyledTableCell
                        align="right"
                        style={{ background: "grey" }}
                      >
                        <Button
                          onClick={() => {
                            handleTeamDelete(team._id);
                          }}
                        >
                          <MdDelete color="white" />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
            {teamMembers.length === 0 && (
              <Typography> No team created</Typography>
            )}
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default TeamTable;
