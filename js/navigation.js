function showScreen(screenId) {
  try {

    const screens = document.querySelectorAll(".screen");

    screens.forEach((screen) => {
      screen.classList.remove("active");
    });

    const screenToShow = document.getElementById(screenId);

    if (screenToShow) {

      screenToShow.classList.add("active");
    } else {
      // Si no existe una pantalla
      console.error(
        `❌ ERROR: No se encontró ninguna pantalla con el ID: "${screenId}"`
      );
      console.info(
        "💡 Pantallas disponibles:",
        Array.from(screens)
          .map((s) => s.id)
          .join(", ")
      );
    }
  } catch (error) {
  
    console.error("❌ ERROR al cambiar de pantalla:", error);
  }
}