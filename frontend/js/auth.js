document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("input[name='email']").value;
    const senha = form.querySelector("input[name='senha']").value;

    // Determinar se é login ou registro com base na página
    const isRegister = document.title.toLowerCase().includes("register");
    const endpoint = isRegister ? "/api/register" : "/api/login";

    const payload = { email, senha };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao enviar dados.");
      } else {
        alert(`Sucesso: ${data.message}`);

        // Armazenar o email do usuário logado no localStorage
        localStorage.setItem("userEmail", email);
        
        // Redirecionar, armazenar token, etc.
        window.location.href = "home.html"; // Redireciona para a página principal
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      alert("Erro de rede ou servidor fora do ar.");
    }
  });
});
