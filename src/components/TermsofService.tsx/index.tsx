import { Box, Heading, Text, VStack, UnorderedList, ListItem } from "@chakra-ui/react";
import React from "react";

function TermsOfUsePage() {
  return (
    <Box width="100%" p="20px">
      <VStack alignItems="start" spacing="1.5rem" width="100%">
        <Text fontSize="lg" fontWeight="bold">
          Effective Date: November 27, 2024
        </Text>

        <Text fontSize="md" color="secondary">
          These Terms of Use ("Terms") govern your access to and use of Nerocity ("Platform"),
          operated by Keygen Labs, Inc. By using the Platform, you agree to these Terms.
        </Text>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            1. Use of the Platform
          </Heading>
          <UnorderedList spacing="0.5rem" fontSize="md" pl="1.5rem" color="secondary">
            <ListItem>You must be at least 18 years old to use the Platform.</ListItem>
            <ListItem>
              The Platform facilitates the launch and management of AI agent coins and related
              transactions. You are solely responsible for understanding the risks associated
              with digital assets and blockchain technology.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            2. Fees and Payments
          </Heading>
          <UnorderedList spacing="0.5rem" fontSize="md" pl="1.5rem" color="secondary">
            <ListItem>
              The Platform charges fees for certain services, including launching AI agent
              coins and transactions. Fees are outlined in our pricing schedule available on
              the Platform.
            </ListItem>
            <ListItem>
              <strong>Fee Updates:</strong> We reserve the right to update our fees at any
              time. Changes will be effective upon posting on the Platform. Continued use of
              the Platform constitutes your agreement to the updated fees.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            3. Prohibited Activities
          </Heading>
          <UnorderedList spacing="0.5rem" fontSize="md" pl="1.5rem" color="secondary">
            <ListItem>Use the Platform for illegal or unauthorized activities.</ListItem>
            <ListItem>Interfere with or disrupt the Platform&apos;s functionality.</ListItem>
            <ListItem>Misrepresent your identity or affiliations.</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            4. Disclaimer
          </Heading>
          <UnorderedList spacing="0.5rem" fontSize="md" pl="1.5rem" color="secondary">
            <ListItem>
              <strong>No Investment Solicitation:</strong> Keygen Labs, Inc. does not solicit
              investment into any coins mentioned or used on the Platform.
            </ListItem>
            <ListItem>
              <strong>No Securities Offering:</strong> Keygen Labs, Inc. does not issue or
              promote securities through the Platform. The coins launched on the Platform are
              user-generated and not issued by Keygen Labs, Inc.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            5. Limitation of Liability
          </Heading>
          <Text fontSize="md" color="secondary">
            The Platform is provided "as is" without any warranties. Keygen Labs, Inc. is not
            liable for any financial losses, missed opportunities, or damages resulting from
            your use of the Platform or reliance on its content.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            6. Indemnification
          </Heading>
          <Text fontSize="md" color="secondary">
            You agree to indemnify and hold Keygen Labs, Inc. harmless from any claims,
            damages, or expenses arising from your use of the Platform or violation of these
            Terms.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            7. Termination
          </Heading>
          <Text fontSize="md" color="secondary">
            We may suspend or terminate your account at any time for violating these Terms or
            engaging in prohibited activities.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            8. Changes to These Terms
          </Heading>
          <Text fontSize="md" color="secondary">
            We may update these Terms at any time. Significant changes will be posted on the
            Platform. Continued use of the Platform after updates constitutes your agreement
            to the revised Terms.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb="0.5rem">
            9. Governing Law
          </Heading>
          <Text fontSize="md" color="secondary">
            These Terms are governed by the laws of the State of New York, without regard to
            its conflict of laws principles.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default TermsOfUsePage;
