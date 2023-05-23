import React, { useCallback, useEffect, useState } from "react";
import SmartTable from "../Tables/sharedTable/sharedTable";
import "./Messages.css";
import moment from "moment";
import { Client } from "@twilio/conversations";
import { SignalWifiStatusbar4BarTwoTone } from "@mui/icons-material";
import { TwilioService } from "./twilioService";
import { getConversationList } from "../../api/Services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const headCells = [
  {
    id: "clientName",
    numeric: false,
    label: "Name",
  },
  {
    id: "companyName",
    numeric: false,
    label: "Company",
  },
  {
    id: "clientOrEstimator",
    numeric: false,
    label: "User Type",
  },
  {
    id: "sid",
    numeric: false,
    label: "Channel Id",
  },
  {
    id: "time",
    numeric: true,
    label: "Time",
  },
];

const Messages = () => {
  const [messagesList, setMessageList] = useState([]);
  const [token, setToken] = useState("");
  const [convoList, setConvoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    let conversationData1 = [];
    const twillioToken = await getConversationList();
    if (twillioToken.success) {
      localStorage.setItem("twillio_token", twillioToken.token);
      setToken(twillioToken.token);
      let conversationData = await Promise.all(
        twillioToken.chatList.map((item, index) => {
          conversationData1.push({
            clientName: item?.uniqueName?.split("-")[0]?.split("&&")[1]
              ? item?.uniqueName?.split("-")[0]?.split("&&")[1]
              : item?.uniqueName?.split("-")[0]
              ? item?.uniqueName?.split("-")[0]
              : item?.uniqueName,
            clientOrEstimator: item?.uniqueName?.split("-")[1]
              ? item?.uniqueName?.split("-")[1]
              : "unknown",
            companyName: item?.uniqueName?.split("&&")[0]
              ? item?.uniqueName?.split("&&")[0]
              : item?.uniqueName,
            time: item?.dateUpdated ? item?.dateUpdated : item.dateUpdated,
            sid: item?.sid,
          });
        })
      );
      getLastMessage(twillioToken.chatList[0]);
      sortData(conversationData1);
    } else {
      toast.error(`${twillioToken.msg}`);
      navigate("../Dashboard", { replace: true });
    }
  };

  const getLastMessage = (item) => {};

  const sortData = (data1) => {
    let data = data1;

    data = data.sort((a, b) => {
      return a.time - b.time;
    });

    const finalData = data.map((obj) => ({
      ...obj,
      message: obj.message === null ? "Media" : obj.message,
      time: moment(obj.time).format("HH:mm | DD-MM-YY"), // just for example
    }));

    setMessageList(finalData);
  };

  return (
    <>
      <SmartTable
        title="Messages"
        data={messagesList}
        fiveRows={messagesList}
        headCells={headCells}
        paginator={false}
        navigation={true}
        pageLink={"Chat"}
        search={true}
      />
    </>
  );
};

export default Messages;
