import {
  Box,
  Button,
  Container,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { LoginFeatures } from "../components/LoginFeatures";

export function Home() {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const { gardenId } = useParams<{ gardenId: string }>();
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Box my={2}>
        <Typography
          variant="h1"
          align="center"
          style={{ color: "#fff" }}
          gutterBottom={true}
        >
          {gardenId}
        </Typography>
      </Box>
      <Paper elevation={0} className={classes.paperContainer}>
        <LoginFeatures />
      </Paper>
    </Container>
  );
}

const useStyles = makeStyles(() => ({
  paperContainer: {
    margin: "1rem 0 1rem 0",
    padding: "1rem",
  },
  listItem: {
    padding: ".5rem 0",
  },
  listItemIcon: {
    minWidth: "2.5rem",
  },
  button: {
    "& + &": {
      marginLeft: ".5rem",
    },
  },
}));
