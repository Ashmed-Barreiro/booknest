<template>
  <section class="auth">
    <div class="card auth-card">
      <h1 class="title">Crear cuenta</h1>
      <p class="muted">Regístrate para gestionar tu biblioteca personal.</p>

      <form class="form" @submit.prevent="onSubmit">
        <div class="form-row">
          <label>Email</label>
          <input class="input" v-model.trim="email" type="email" autocomplete="email" required />
        </div>

        <div class="form-row">
          <label>Password</label>
          <input
            class="input"
            v-model="password"
            type="password"
            minlength="6"
            autocomplete="new-password"
            required
          />
          <small class="hint">Mínimo 6 caracteres</small>
        </div>

        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? "Creando..." : "Register" }}
        </button>

        <p v-if="error" class="alert alert-error">{{ error }}</p>
        <p v-if="ok" class="alert alert-success">Cuenta creada. Redirigiendo...</p>

        <p class="muted small">
          ¿Ya tienes cuenta?
          <RouterLink to="/login">Login</RouterLink>
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
const ok = ref(false);

async function onSubmit() {
  error.value = "";
  ok.value = false;
  loading.value = true;

  try {
    const data = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.user.email);

    ok.value = true;
    setTimeout(() => router.push("/books"), 600);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
