<template>
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">{{ isEdit ? "Editar libro" : "Nuevo libro" }}</h2>
      <p class="muted small">Campos obligatorios: título y autor.</p>
    </div>

    <form class="form grid-2" @submit.prevent="submit">
      <div class="form-row">
        <label>Título</label>
        <input class="input" v-model.trim="form.title" required />
      </div>

      <div class="form-row">
        <label>Autor</label>
        <input class="input" v-model.trim="form.author" required />
      </div>

      <div class="form-row">
        <label>Estado</label>
        <select class="input" v-model="form.status">
          <option value="pending">Pendiente</option>
          <option value="reading">Leyendo</option>
          <option value="done">Terminado</option>
        </select>
      </div>

      <div class="form-row">
        <label>Rating (1-5)</label>
        <input class="input" v-model.number="form.rating" type="number" min="1" max="5" />
      </div>

      <div class="form-row full">
        <label>Notas</label>
        <textarea class="input" v-model="form.notes" rows="3"></textarea>
      </div>

      <div class="actions full">
        <button class="btn btn-secondary" type="button" @click="$emit('cancel')">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading">
          {{ loading ? "Guardando..." : (isEdit ? "Guardar cambios" : "Crear") }}
        </button>
      </div>

      <p v-if="error" class="alert alert-error full">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["submit", "cancel"]);

const error = ref("");

const empty = () => ({
  title: "",
  author: "",
  status: "pending",
  rating: null,
  notes: ""
});

const form = reactive(empty());

const isEdit = computed(() => !!props.modelValue?.id);

watch(
  () => props.modelValue,
  (val) => {
    error.value = "";
    Object.assign(form, empty());
    if (val) {
      Object.assign(form, {
        title: val.title ?? "",
        author: val.author ?? "",
        status: val.status ?? "pending",
        rating: val.rating ?? null,
        notes: val.notes ?? ""
      });
    }
  },
  { immediate: true }
);

function submit() {
  error.value = "";
  if (!form.title || !form.author) {
    error.value = "Título y autor son obligatorios.";
    return;
  }

  emit("submit", {
    title: form.title,
    author: form.author,
    status: form.status,
    rating: form.rating === "" ? null : form.rating,
    notes: form.notes
  });
}
</script>
