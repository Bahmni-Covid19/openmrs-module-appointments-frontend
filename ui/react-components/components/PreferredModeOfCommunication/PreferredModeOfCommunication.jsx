import React, { useState } from "react";
import classNames from "classnames";
import {
  checkbox,
  checkboxContainer,
  container,
  popUp,
  popUpCloseIcon,
  popUpTitle,
  contactDetails,
  save,
  button,
  popUpFooter,
  flex,
} from "./PreferredModeOfCommunication.module.scss";
import {
  getPatientEmailFromUuid,
  getPatientPrimaryContactFromUuid,
} from "../../services/AppointmentsService/AppointmentsService";
import { FormattedMessage } from "react-intl";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import Label from "../Label/Label.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import PropTypes from "prop-types";

const PreferredModeOfCommunication = (props) => {

  const {updateAppointmentDetails, patient, showPopup } = props;

  const [smsBoxSelected, setSmsBoxSelected] = useState(false);
  const [emailBoxSelected, setEmailBoxSelected] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [patientContact, setPatientContact] = useState("");

  const checkDisableButton = () => {
    if (
      (emailBoxSelected && patientEmail === "") ||
      (smsBoxSelected && patientContact === "")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const email = async (patientUuid) => {
    const response = await getPatientEmailFromUuid(patientUuid);
    const status = response.status;
    if (status === 200) {
      setPatientEmail(response.data);
    } 
  };

  const primaryContact = async (patientUuid) => {
    const response = await getPatientPrimaryContactFromUuid(patientUuid);
    const status = response.status;
    if (status === 200) {
      setPatientContact(response.data);
    } 
  };

  const smsCheck = async () => {
    if (!smsBoxSelected) {
      await primaryContact(patient.uuid);
    }
    setSmsBoxSelected(!smsBoxSelected);
  };

  const emailCheck = async () => {
    if (!emailBoxSelected) {
      await email(patient.uuid);
    }
    setEmailBoxSelected(!emailBoxSelected);
  };

  const unselectPopup = () => {
    updateAppointmentDetails({ teleconsultation: false });
    showPopup(false);
  }

  return (
    <div>
      <div className={classNames(popUp)}>
        <div className={classNames(popUpCloseIcon)}>
          <button
            data-testid="save-close-icon"
            tabIndex={3}
            onClick={unselectPopup}
          >
            <i className={classNames("fa", "fa-times")} />
          </button>
        </div>
        <h1 className={classNames(popUpTitle)}>
          <FormattedMessage
            id={"PREFERRED_MODE_OF_COMMUNICATION_TITLE"}
            defaultMessage={"Preferred Mode of Communication"}
          />
        </h1>
      </div>
      <div className={classNames(container)}>
        <div className={classNames(checkboxContainer)} data-testid="sms">
          <Checkbox
            defaultChecked={false}
            className={classNames(checkbox)}
            name={"sms-communication"}
            isDisabled={!smsBoxSelected}
            onChange={smsCheck}
          />
          <Label
            forInput="sms-selection-checkbox"
            translationKey={"SMS"}
            defaultValue="SMS"
          />
        </div>
        <div className={classNames(checkboxContainer)} data-testid="email">
          <Checkbox
            defaultChecked={false}
            className={classNames(checkbox)}
            name={"email-communication"}
            isDisabled={!emailBoxSelected}
            onChange={emailCheck}
          />
          <Label
            forInput="email-selection-checkbox"
            translationKey={"EMAIL"}
            defaultValue="E-Mail"
          />
        </div>
      </div>
<div>
        {smsBoxSelected ? (
          <p className={classNames(contactDetails)}>
            Confirm your mobile number: {patientContact}
          </p>
        ) : null}
        {emailBoxSelected ? (
          <p className={classNames(contactDetails)}>
            Confirm your email-id: {patientEmail}
          </p>
        ) : null}
      </div>
      <div className={classNames(popUpFooter)}>
        {smsBoxSelected || emailBoxSelected ? (
          <div className={classNames(flex)}>
            <ErrorMessage
              message={
                checkDisableButton() ? "Kindly register your details" : undefined
              }
            />
            <button
              className={classNames(button, save)}
              data-testid="confirm-details"
              disabled={checkDisableButton()}
              type = "submit"
              onClick={() =>
                showPopup(false)
              }
            >
              <i className={classNames("fa", "fa-check")} />
              <span>
                <FormattedMessage
                  id={"CONFIRM-COMMUNICATION-DETAILS"}
                  defaultMessage={"Confirm"}
                />
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

PreferredModeOfCommunication.propTypes = {
  updateAppointmentDetails: PropTypes.func,
  patient: PropTypes.object,
  showPopup: PropTypes.func
};

export default PreferredModeOfCommunication;
