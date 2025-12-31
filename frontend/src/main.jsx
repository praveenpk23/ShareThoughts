import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import HomeFeed from "./features/posts/pages/HomeFeed.jsx";
import ProfileScreen from "./features/users/pages/ProfileScreen.jsx";
import PostDetails from "./features/posts/pages/PostDetails.jsx";
import ProfileDetails from "./features/users/pages/ProfileDetails.jsx";
import LoginScreen from "./features/auth/pages/LoginScreen.jsx";
import RegisterScreen from "./features/auth/pages/RegisterScreen.jsx";
import NotFound from "./NotFound";
import PostForm from "./features/posts/pages/PostForm.jsx";
import SearchPage from './features/posts/pages/SearchPage.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeFeed />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/post" element={<PostForm />} />
      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/profile/:id" element={<ProfileDetails />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
