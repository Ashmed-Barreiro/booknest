<template>
  <section>
    <div class="page-header">
      <div>
        <h1 class="title">Mis libros</h1>
        <p class="muted">Crea, edita y elimina libros. Solo con sesión iniciada.</p>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" @click="openCreate">+ Nuevo</button>
      </div>
    </div>

    <div v-if="loading" class="card">
      <p class="muted">Cargando...</p>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div v-if="!loading && books.length === 0" class="card">
      <p class="muted">Aún no tienes libros. Crea el primero.</p>
    </div>

    <div class="grid-cards" v-if="books.length">
      <article class="card" v-for="b in books" :key="b.id">
        <div class="book-top">
          <h3 class="card-title">{{ b.title }}</h3>
          <span class="badge" :class="badgeClass(b.status)">{{ statusLabel(b.status) }}</span>
        </div>

        <p class="muted small">Autor: <strong>{{ b.author }}</strong></p>

        <p class="small" v-if="b.rating">
          Rating: <strong>{{ b.rating }}/5</strong>
        </p>

        <p class="small" v-if="b.notes">
          <span class="muted">Notas:</span> {{ b.notes }}
        </p>

        <div class="actions">
          <button class="btn btn-secondary" @click="openEdit(b)">Editar</button>
          <button class="btn btn-danger" @click="remove(b)">Eliminar</button>
        </div>
      </article>
    </div>

    <div class="modal-backdrop" v-if="showForm">
      <div class="modal">
        <BookForm
          :modelValue="editing"
          :loading="formLoading"
          @cancel="closeForm"
          @submit="save"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { apiFetch, logout } from "../services/api.js";
import { useRouter } from "vue-router";
import BookForm from "../components/BookForm.vue";

const router = useRouter();

const books = ref([]);
const loading = ref(false);
const error = ref("");

const showForm = ref(false);
const editing = ref(null);
const formLoading = ref(false);

function statusLabel(s) {
  if (s === "reading") return "Leyendo";
  if (s === "done") return "Terminado";
  return "Pendiente";
}

function badgeClass(s) {
  if (s === "reading") return "badge-info";
  if (s === "done") return "badge-success";
  return "badge-warn";
}

async function load() {
  error.value = "";
  loading.value = true;

  try {
    const data = await apiFetch("/books");
    books.value = data;
  } catch (e) {
    if (String(e.message).toLowerCase().includes("token")) {
      logout();
      router.push("/login");
      return;
    }
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = null;
  showForm.value = true;
}

function openEdit(book) {
  editing.value = book;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editing.value = null;
}

async function save(payload) {
  formLoading.value = true;

  try {
    if (editing.value?.id) {
      await apiFetch(`/books/${editing.value.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    closeForm();
    await load();
  } catch (e) {
    error.value = e.message;
  } finally {
    formLoading.value = false;
  }
}

async function remove(book) {
  const ok = confirm(`Eliminar "${book.title}"?`);
  if (!ok) return;

  try {
    await apiFetch(`/books/${book.id}`, { method: "DELETE" });
    await load();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(load);
</script>
