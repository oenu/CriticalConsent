import { useEffect, useState } from "react";

// Mantine Components
import {
  AppShell,
  Burger,
  Container,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Title,
  useMantineTheme,
} from "@mantine/core";

// React Router
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  closeBurgerMenu,
  selectBurgerMenuOpen,
  toggleBurgerMenu,
} from "./features/app/appSlice";

// Redux
import {
  fetchQuestionsAsync,
  getQuestionsStatus,
} from "./features/survey/surveySlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

export default function App() {
  // Watch current location for changes
  const location = useLocation();

  // Theme from Mantine Package
  const theme = useMantineTheme();

  // Redux wrapper for dispatch
  const dispatch = useAppDispatch();

  // Whether the burger menu is open
  const burgerOpen = useAppSelector(selectBurgerMenuOpen);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!burgerOpen}
          width={{ sm: 150, lg: 150 }}
        >
          <Navbar.Section grow mt="md">
            <NavLink
              label="Home"
              active={location.pathname === "/"}
              component={Link}
              to="/"
              onClick={() => dispatch(closeBurgerMenu())}
            />
            <NavLink
              label="Register"
              active={location.pathname === "/register"}
              component={Link}
              to="/register"
              onClick={() => dispatch(closeBurgerMenu())}
            />
            <NavLink
              label="Survey"
              active={location.pathname === "/survey"}
              component={Link}
              to="/survey"
              onClick={() => dispatch(closeBurgerMenu())}
            />
          </Navbar.Section>
          <Navbar.Section>
            <NavLink
              label="About"
              active={location.pathname === "/about"}
              onClick={() => dispatch(closeBurgerMenu())}
            />
            <NavLink
              label="Contact"
              active={location.pathname === "/contact"}
              onClick={() => dispatch(closeBurgerMenu())}
            />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={burgerOpen}
                onClick={() => dispatch(toggleBurgerMenu())}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title>Critical Consent</Title>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
