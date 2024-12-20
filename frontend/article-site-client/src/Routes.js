import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LoginForm from './components/LoginForm';
import QuestionDetail from './components/QuestionDetail';
import QuestionList from './components/QuestionList';
import QuestionForm from './components/QuestionForm';
import QuestionModifyForm from './components/QuestionModifyForm';
import AnswerModifyForm from './components/AnswerModifyForm';
import SignupForm from './components/SignupForm';
import PrivateRoute from './components/common/PrivateRoute';
import FindPasswordForm from './components/FindPasswordForm';
import ProfilePage from './components/ProfilePage';
import UpdatePasswordForm from './components/UpdatePasswordForm';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<QuestionList />} />
        <Route path="/list" element={<QuestionList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
        <Route
          path="/question/new"
          element={
            <PrivateRoute>
              <QuestionForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/question/modify/:id"
          element={
            <PrivateRoute>
              <QuestionModifyForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/answer/modify/:id"
          element={
            <PrivateRoute>
              <AnswerModifyForm />
            </PrivateRoute>
          }
        />
        <Route path="/find-password" element={<FindPasswordForm />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <PrivateRoute>
              <UpdatePasswordForm />
            </PrivateRoute>
          }
        />
      </Route>
    </RouterRoutes>
  );
};

export default Routes; 