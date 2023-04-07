import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Button,
  Input,
  Image,
  FormControl,
  FormLabel,
  FormHelperText,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  DarkMode,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const App = () => {
  interface repos {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    forks_count: number;
    open_issues_count: number;
    pushed_at: string;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [repos, setRepos] = useState<repos[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const Cards = useColorModeValue("light", "dark");
  const [showingUser, setshowingUser] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchTerm}`
      );
      const data = await response.json();
      if (data.items) {
        const users = data.items.slice(0, 5);
        setUsers(users);
        setErrorMessage("");
        setshowingUser(true);
      } else {
        setUsers([]);
        setErrorMessage("No users found");
        setshowingUser(false);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
      setErrorMessage("Failede to fetch users");
      setshowingUser(false);
    }
  };

  const fetchRepos = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${selectedUser.login}/repos`
      );
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      fetchUsers();
      fetchRepos();
    }
  };

  const handleSelectUser = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const userData = await response.json();
      if (userData) {
        setSelectedUser(userData);
        fetchRepos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChakraProvider>
      <Box fontSize="xl">
        <Grid minH="100vh" p={3}>
          <form onSubmit={handleSearch}>
            <FormControl textAlign="center">
              <FormLabel textAlign={"center"}>
                Search Username <ColorModeSwitcher margin={0} />
              </FormLabel>
              <Input
                className="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a user"
              />
              <FormHelperText marginBottom={15}>
                Please input your username.
              </FormHelperText>
              <Button colorScheme="cyan" textColor="black" type="submit">
                Search
              </Button>
              {showingUser && (
                <Text marginTop={5} marginBottom={10}>
                  Showing users from {searchTerm}
                </Text>
              )}
            </FormControl>
          </form>
          {errorMessage && <p>{errorMessage}</p>}
          <div className="userList">
            {users.map((user) => (
              <Accordion allowToggle allowMultiple={false}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        key={user.id}
                        onClick={() => handleSelectUser(user.login)}
                        as="span"
                        flex={1}
                        textAlign="left"
                      >
                        {user.login}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  {selectedUser && (
                    <AccordionPanel pb={4}>
                      <Box>
                        <Center>
                          <Image
                            boxSize={100}
                            borderRadius="full"
                            content="center"
                            src={selectedUser.avatar_url}
                          />
                        </Center>
                        <Text align={"center"}>{selectedUser.login}</Text>
                        {repos.map((repo) => {
                          return (
                            <Card
                              key={repo.id}
                              marginTop={5}
                              shadow="xl"
                              bg={Cards}
                            >
                              <CardBody>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Box alignContent="center">
                                    <Text as="b" fontSize="md">
                                      {repo.name}
                                    </Text>
                                    <Text fontSize="md">
                                      {repo.description}
                                    </Text>
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    marginLeft={5}
                                  >
                                    <AiFillStar />
                                    <Text fontSize="md" marginLeft="0.5rem">
                                      {repo.stargazers_count}
                                    </Text>
                                  </Box>
                                </Box>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </Box>
                    </AccordionPanel>
                  )}
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
