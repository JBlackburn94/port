import { ref, onMounted, onBeforeUnmount } from "vue";
import { site } from "../data/site.js";

const format = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }).format(
    new Date()
  );

// Local time where Jason is, updated every 15 seconds
export function useLocalTime() {
  const time = ref(format());
  let id;
  onMounted(() => (id = setInterval(() => (time.value = format()), 15000)));
  onBeforeUnmount(() => clearInterval(id));
  return time;
}
