function Agente(nome, agentInfo, agentIcon, portrait, background, backgroundColors, role, roleInfo, abilities, abilityIcons, abilityInfos) {
    this.name = nome
    this.agentInfo = agentInfo
    this.agentIcon = agentIcon
    this.portrait = portrait
    this.background = background
    this.backgroundColors = backgroundColors
    this.role = role
    this.roleInfo = roleInfo
    this.abilities = abilities
    this.abilityIcons = abilityIcons
    this.abilityInfos = abilityInfos
}

let agentes = []
let agentSelected

async function getAgents() {
    let url = "https://valorant-api.com/v1/agents?language=pt-BR&isPlayableCharacter=True"
    let response = await fetch(url)

    let agents = await response.json()
    agents = agents["data"]
    
    agents.forEach(element => {

        let skillName = []
        let skillIcon = []
        let skillInfo = []

        skillIcon[0] = element["role"]["displayIcon"]
        element["abilities"].forEach(skill => {
            switch (skill["slot"]) {
                case "Grenade":
                    skillName[0] = skill["displayName"]
                    skillIcon[1] = skill["displayIcon"]
                    skillInfo[0] = skill["description"]
                    break;

                case "Ability1":
                    skillName[1] = skill["displayName"]
                    skillIcon[2] = skill["displayIcon"]
                    skillInfo[1] = skill["description"]
                    break;

                case "Ability2":
                    skillName[2] = skill["displayName"]
                    skillIcon[3] = skill["displayIcon"]
                    skillInfo[2] = skill["description"]
                    break;
            
                case "Ultimate":
                    skillName[3] = skill["displayName"]
                    skillIcon[4] = skill["displayIcon"]
                    skillInfo[3] = skill["description"]
                    break;
            }
        })

        let gradient = []
        element["backgroundGradientColors"].forEach(cor => {
            gradient.push(cor)
        })

        let agente = new Agente(element["displayName"], element["description"], element["displayIcon"], element["fullPortrait"], element["background"], gradient, element["role"]["displayName"], element["role"]["description"], skillName, skillIcon, skillInfo)

        agentes.push(agente)
    });

    agentSelected = agentes[0]

    setView()
}

window.onload = getAgents()

function setView() {
    let agentSelection = document.querySelector("#agent-selection")

    let i = 0
    agentes.forEach(element => {
        let div = document.createElement("div")
        let icon = document.createElement("img")
    
        div.className = "icon"

        div.dataset.id = i

        div.addEventListener("click", changeView)

        icon.src = element.agentIcon
    
        div.appendChild(icon)

        agentSelection.appendChild(div)
    
        i++
    })

    agentSelection.firstChild.classList.add("selected")
}

function changeView() {
    agentSelected = (this == undefined) ? agentes[0] : agentes[this.dataset["id"]]
    let agentImg = document.querySelector("#agent")

    document.querySelectorAll(".icon").forEach(e => {
        e.classList.remove("selected")
    })

    let iconSelected = document.querySelector(`.icon[data-id="${agentes.indexOf(agentSelected)}"]`)

    iconSelected.classList.add("selected")
    
    document.querySelector("main").style = `background: linear-gradient(to right, #${agentSelected["backgroundColors"][0]}, #${agentSelected["backgroundColors"][1]}, #${agentSelected["backgroundColors"][2]}, #${agentSelected["backgroundColors"][3]})`

    agentImg.style = `background-image: url('${agentSelected["background"]}')`

    agentImg.firstChild.style = `background-image: url('${agentSelected["portrait"]}');`

    let nome = document.querySelector("#agent-info h1")
    let role = document.querySelector("#agent-info h2")
    let abilityIcon = document.querySelectorAll(".ability img")

    nome.innerHTML = agentSelected["name"]
    role.innerHTML = agentSelected["role"]

    for(let i=0; i<=4; i++) {
        abilityIcon[i].src = agentSelected["abilityIcons"][i]
    }

    changeTab(document.querySelector(".ability"))
    toggleNavbar()
}

function changeTab(e) {
    tabs = document.querySelectorAll(".ability");
    tabs.forEach(element => {
        element.classList.remove("active")
    })

    console.log(e)

    e.className += " active"

    let ability = e.childNodes[0]["nextSibling"].innerHTML

    let p = document.querySelectorAll(".tab-content p")
    let h3 = document.querySelector(".tab-content h3")
    p[0].innerText = ""
    switch (ability) {
    case "C":
        h3.innerHTML = agentSelected["abilities"][0]
        p[1].innerHTML = agentSelected["abilityInfos"][0]
        break;

    case "Q":
        h3.innerHTML = agentSelected["abilities"][1]
        p[1].innerHTML = agentSelected["abilityInfos"][1]
        break;

    case "E":
        h3.innerHTML = agentSelected["abilities"][2]
        p[1].innerHTML = agentSelected["abilityInfos"][2]
        break;

    case "X":
        h3.innerHTML = agentSelected["abilities"][3]
        p[1].innerHTML = agentSelected["abilityInfos"][3]
        break;

    default:
        h3.innerHTML = agentSelected["role"]
        p[0].innerHTML = agentSelected["agentInfo"]
        p[1].innerHTML = agentSelected["roleInfo"]
        break;
    }
}

function toggleNavbar() {
    let toggle = document.querySelector("#openbtn")
    let state = toggle.innerHTML

    toggle.innerHTML = state == "menu" ? "close" : "menu"

    if(state == "menu") {
        state = "close"
        toggle.innerHTML = state
        document.querySelector("#agent-selection").style = "display: flex;"
    } else {
        state = "menu"
        toggle.innerHTML = state
        document.querySelector("#agent-selection").style = "display: none;"
    }
}