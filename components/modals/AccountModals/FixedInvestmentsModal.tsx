import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { useAuth } from "../../../src/auth/auth";
import { Formik } from "formik";
import {
  InputControl,
  NumberInputControl,
  SubmitButton,
} from "formik-chakra-ui";
import { addAccount } from "../../../src/firebase/UserActions";
import { Timestamp } from "firebase/firestore";

export default function FixedInvestmentsModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a fixed investment account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              startDate: "",
              maturityDate: "",
              startingValue: 0,
              interestRate: 0,
              error: null,
            }}
            onSubmit={(values, actions) => {
              if (userData) {
                addAccount(
                  userData.uid,
                  userData.financialInfo.accounts,
                  "FixedInvestment",
                  {
                    name: values.name,
                    startDate: new Timestamp(
                      Date.parse(values.startDate) / 1000,
                      0
                    ),
                    maturityDate: new Timestamp(
                      Date.parse(values.maturityDate) / 1000,
                      0
                    ),
                    startingValue: values.startingValue,
                    interestRate: values.interestRate,
                  }
                );
                actions.resetForm;
                props.onClose();
              } else {
                alert("Error: User not logged in...");
              }
            }}
          >
            {({ handleSubmit, values }) => (
              <Box
                as="form"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={handleSubmit as any}
              >
                <InputControl name="name" label="Account Name" />
                <InputControl
                  inputProps={{ type: "date" }}
                  name="startDate"
                  label="Start date"
                />
                <InputControl
                  inputProps={{ type: "date" }}
                  name="maturityDate"
                  label="Maturity date"
                />
                <NumberInputControl
                  name="startingValue"
                  label="Starting value"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                <NumberInputControl
                  name="interestRate"
                  label="Fixed Term Investment Interest Rate (%)"
                  numberInputProps={{
                    min: 0,
                    step: 1,
                    precision: 2,
                  }}
                />
                {values.error !== null ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{values.error}</AlertTitle>
                  </Alert>
                ) : (
                  <></>
                )}
                <SubmitButton mt={"20px"} colorScheme={"green"}>
                  Add fixed term investment
                </SubmitButton>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
