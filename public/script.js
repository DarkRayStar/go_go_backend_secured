const button = document.querySelector("button")
button.addEventListener("click", () => {
  fetch("http://localhost:5050/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: "Spiderman - NO WAY HOME - 4K CINEMA", quantity: 2 },
        { id: "JOKER - DOLBY THEATER", quantity: 4},
      ]
    }
    ),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})
