import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useUser } from "../hooks/use-user";
import { useAuth } from "@workos-inc/authkit-react";
import { Button as RadixButton } from "@radix-ui/themes";
import { UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import '@radix-ui/themes/styles.css'; // Import Radix styles

export default function Account() {
  const user = useUser();

  const auth = useAuth() as ReturnType<typeof useAuth> & {
    getToken: () => Promise<string>;
  };

  const { getToken, role, organizationId } = auth;
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
      } catch (error) {
        console.error("Failed to fetch auth token:", error);
      }
    };

    fetchToken();
  }, [getToken]);

  if (!user) {
    return <Text align="center">Loading user...</Text>;
  }

  const userFields = [
    ["First name", user.firstName],
    ["Last name", user.lastName],
    ["Email", user.email],
    role ? ["Role", role] : [],
    ["Id", user.id],
    organizationId ? ["Organization Id", organizationId] : [],
  ].filter((arr) => arr.length > 0);

  return (
    <>
      <Flex direction="column" gap="2" mb="7">
        <Heading size="8" align="center">Account details</Heading>
        <Text size="5" align="center" color="gray">
          Below are your account details
        </Text>

        <RadixButton
          onClick={() => alert(`Token: ${authToken || "Fetching token..."}`)}
          size="2"
          variant="soft"
        >
          View Token
        </RadixButton>
      </Flex>

      {userFields.length > 0 && (
        <Flex direction="column" justify="center" gap="3" width="400px">
          {userFields.map(([label, value]) => (
            <Flex asChild align="center" gap="6" key={label}>
              <label>
                <Text weight="bold" size="3" style={{ width: 100 }}>{label}</Text>
                <Box flexGrow="1">
                  <TextField.Root value={value || ""} readOnly />
                </Box>
              </label>
            </Flex>
          ))}
        </Flex>
      )}

      {authToken && (
        <WorkOsWidgets theme={{ appearance: 'light' }}>
          <UsersManagement authToken={authToken} />
        </WorkOsWidgets>
      )}
    </>
  );
}