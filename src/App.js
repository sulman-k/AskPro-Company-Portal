import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "./Routes/Index";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./Views/Error/ErrorPage";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { notificationCountAction } from "./Redux/Actions/Action";
import { getUnreadNotifications } from "./api/Services";

function ErrorHandler({ error }) {
  return (
    <div role="alert">
      <ErrorPage error={error.message} />
    </div>
  );
}

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    notificationCount();
    notificationCountApi();
  }, []);

  const notificationCount = () => {
    setInterval(async () => {
      await notificationCountApi();
    }, 30000);
  };

  const notificationCountApi = async () => {
    try {
      const response = await getUnreadNotifications();
      if (response.success) {
        dispatchingNotificationsCount(response.unreadNotifications);
      } else {
        dispatchingNotificationsCount(0);
      }
    } catch (error) {
      toast.error(error.message);
    }
    return true;
  };

  const dispatchingNotificationsCount = (data) => {
    dispatch(notificationCountAction(data));
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <div className="App">
        <Router />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
