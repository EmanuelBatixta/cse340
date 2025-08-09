const passInput = document.getElementById("account_password");
const patterns = document.querySelector(".patterns");
const charPattern = document.getElementById("charPattern");
const numPattern = document.getElementById("numPattern");
const lowPattern = document.getElementById("lowPattern");
const capPattern = document.getElementById("capPattern");
const spePattern = document.getElementById("spePattern");

passInput.addEventListener("input", () => {
    if(passInput.value.length <= 0) {
        patterns.classList.add("hide")
    } else {
        patterns.classList.remove("hide");
    }
});

passInput.addEventListener("keyup", () => {
    charPattern.classList.toggle("validPattern", passInput.value.length >= 12);
    numPattern.classList.toggle("validPattern", /\d/.test(passInput.value)); //has a number?
    lowPattern.classList.toggle("validPattern", /[a-z]/.test(passInput.value)); //has a lowercase letter?
    capPattern.classList.toggle("validPattern", /[A-Z]/.test(passInput.value)); //has a capital letter?
    spePattern.classList.toggle("validPattern", /[^a-zA-Z0-9]/.test(passInput.value)); //has a special char?
});

const form = document.querySelector("#accountForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update-account")
      updateBtn.removeAttribute("disabled")
})

