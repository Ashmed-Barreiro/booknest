<template>
  <section class="auth">
    <div class="card auth-card">
      <h1 class="title">Login</h1>
      <p class="muted">Accede a tu BookNest.</p>

      <form class="form" @submit.prevent="onSubmit">
        <div class="form-row">
          <label>Email</label>
          <input class="input" v-model.trim="email" type="email" autocomplete="email" required />
        </div>

        <div class="form-row">
          <label>Password</label>
          <input class="input" v-model="password" type="password" autocomplete="current-password" required />
        </div>

        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? "Entrando..." : "Login" }}
        </button>

        <p v-if="error" class="alert alert-error">{{ error }}</p>

        <p class="muted small">
          ¿No tienes cuenta?
          <RouterLink to="/register">Register</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../services/api.js";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  error.value = "";
  loading.value = true;

  try {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.user.email);

    router.push("/books");
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
