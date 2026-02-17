import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import BooksView from "../views/BooksView.vue";

const routes = [
  { path: "/", redirect: "/books" },
  { path: "/login", component: LoginView, meta: { public: true } },
  { path: "/register", component: RegisterView, meta: { public: true } },
  { path: "/books", component: BooksView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const isPublic = to.meta.public === true;
  const token = localStorage.getItem("token");

  if (!isPublic && !token) {
    return "/login";
  }
});

export default router;
