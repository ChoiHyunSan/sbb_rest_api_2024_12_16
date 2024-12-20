// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LoginForm from './components/LoginForm';
import QuestionDetail from './components/QuestionDetail';
import QuestionList from './components/QuestionList';
import QuestionForm from './components/QuestionForm';
import QuestionModifyForm from "./components/QuestionModifyForm";
import AnswerModifyForm from "./components/AnswerModifyForm";
import SignupForm from "./components/SignupForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/question/:id" element={<QuestionDetail />} />
                <Route path="/list" element={<QuestionList />} />
                <Route path="/question/new" element={<QuestionForm />} />
                <Route path="/question/modify" element={<QuestionModifyForm />} />
                <Route path="/answer/modify" element={<AnswerModifyForm />} />
                <Route path="/signup" element={<SignupForm />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;