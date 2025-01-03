import {
  Box,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import React from "react";

function PrivacyPage() {
  return (
    <Box width="100%" p="20px">
      <VStack alignItems="start" spacing="1.5rem" width="100%">
        <Text fontSize="lg" fontWeight="bold">
          Effective Date: November 27, 2024
        </Text>

        <Text fontSize="md" color="secondary">
          Keygen Labs, Inc. ("we," "our," "us") respects your privacy and is
          committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, and disclose your information when you
          use Nerocity ("Platform"). By accessing or using the Platform, you
          agree to this Privacy Policy.
        </Text>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            1. Information We Collect
          </Heading>
          <UnorderedList
            spacing="0.5rem"
            fontSize="md"
            pl="1.5rem"
            color="secondary"
          >
            <ListItem>
              <strong>Account Information:</strong> When you register on the
              Platform, we collect your email address, username, and any other
              details you provide.
            </ListItem>
            <ListItem>
              <strong>Usage Data:</strong> We collect information on how you use
              the Platform, including transaction history, interactions, and
              preferences.
            </ListItem>
            <ListItem>
              <strong>Device Data:</strong> We may collect device-specific
              information like IP address, browser type, and operating system.
            </ListItem>
            <ListItem>
              <strong>Cookies:</strong> We use cookies to enhance your
              experience on the Platform. You can control cookie settings
              through your browser.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            2. How We Use Your Information
          </Heading>
          <Text fontSize="md" color="secondary">
            We use your information to:
          </Text>
          <UnorderedList
            spacing="0.5rem"
            fontSize="md"
            pl="1.5rem"
            color="secondary"
          >
            <ListItem>Operate and improve the Platform.</ListItem>
            <ListItem>Facilitate transactions and services.</ListItem>
            <ListItem>
              Communicate with you about updates, features, or issues.
            </ListItem>
            <ListItem>
              Monitor Platform performance and detect fraudulent or unauthorized
              activity.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            3. How We Share Your Information
          </Heading>
          <Text fontSize="md" color="secondary">
            We do not sell your personal information to third parties. However,
            we may share your information with:
          </Text>
          <UnorderedList
            spacing="0.5rem"
            fontSize="md"
            pl="1.5rem"
            color="secondary"
          >
            <ListItem>
              <strong>Service Providers:</strong> To assist with Platform
              operations such as payment processing or analytics.
            </ListItem>
            <ListItem>
              <strong>Legal Compliance:</strong> If required by law, regulation,
              or court order.
            </ListItem>
            <ListItem>
              <strong>Security Reasons:</strong> To prevent fraud, enforce our
              Terms, or protect the safety of users.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            4. Underage Policy
          </Heading>
          <Text fontSize="md" color="secondary">
            The Platform is not intended for individuals under the age of 18. By
            using the Platform, you represent that you are at least 18 years
            old. We do not knowingly collect or store information from
            individuals under 18. If we discover that a user under 18 has
            provided information, we will delete it promptly.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            5. Your Rights
          </Heading>
          <UnorderedList
            spacing="0.5rem"
            fontSize="md"
            pl="1.5rem"
            color="secondary"
          >
            <ListItem>
              <strong>Access and Update:</strong> You can access and update your
              account information at any time.
            </ListItem>
            <ListItem>
              <strong>Data Deletion:</strong> You may request the deletion of
              your account and personal information by contacting us.
            </ListItem>
            <ListItem>
              <strong>Opt-Out:</strong> You can opt-out of promotional
              communications by following the instructions in those messages.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            6. Changes to This Privacy Policy
          </Heading>
          <Text fontSize="md" color="secondary">
            We may update this Privacy Policy at any time. We will notify users
            of significant changes by posting the updated policy on the Platform
            and revising the "Effective Date."
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default PrivacyPage;
