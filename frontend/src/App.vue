<template>
  <div>
    <header class="navbar">
      <div class="container navbar-inner">
        <div class="brand">
          <span class="brand-dot"></span>
          <span>BookNest</span>
        </div>

        <nav class="nav">
          <RouterLink class="nav-link" to="/books">Mis libros</RouterLink>

          <div class="nav-right">
            <span v-if="userEmail" class="user-pill">{{ userEmail }}</span>

            <RouterLink v-if="!userEmail" class="btn btn-secondary" to="/login">Login</RouterLink>
            <RouterLink v-if="!userEmail" class="btn btn-primary" to="/register">Register</RouterLink>

            <button v-if="userEmail" class="btn btn-danger" @click="handleLogout">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="container main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { logout } from "./services/api.js";

const router = useRouter();
const userEmail = computed(() => localStorage.getItem("userEmail"));

function handleLogout() {
  logout();
  router.push("/login");
}
</script>
