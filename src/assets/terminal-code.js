// Slow terminal emulation effect
// Original version: Navinda Dissanayake / https://codepen.io/ipman98

const terminalPrompt = "[guest@yarik.cloud:]~$ ";

const selectPrompt = "\n\nSelect > ";

const startCommand = `./lorenz && sh welcome.sh

--------------------------------------------------
--  Welcome to my business card                 --
--------------------------------------------------

1) Contact details
2) Projects
3) Skills
4) CV.pdf
5) Lorenz attractor

9) Exit console`;

const contactInfo = `
--------------------------------------------------
Email    yarik@iki.fi
Github   https://github.com/yArIk4
LinkedIN https://www.linkedin.com/in/jarikuokkanen
Facebook https://www.facebook.com/jari.kuokkanen
--------------------------------------------------`;

const projectInfo = `Keysight Technologies
1998 Nemo Wanderer 3.1 - sw
     - semi-autonomous cellular field measurement device
1999 NIB 1.0 - projm / hw / sw
     - world first cellphone integrated field measurement device
2000 NIB 2.0 product line - projm / hw / sw
     NIB Solo, NIB Outdoor, NIB Indoor & Nemo Test Transmitter, NIB Autonomous & Nemo Fleet Manager
     - manual and autonomous cellular field and indoor measurement solutions
2001 EPC 1.0 product line - projm / hw / sw
2002 EPC 2.0 product line - projm / hw / sw
    - autonomous cellular field measurement solutions with fleet manager
2003 MMAC 2.0 & 2.1 - projm / hw
     - supporting systems for multiple field measurement devices
2004 MMAC3.0 - projm / hw
     - supporting system with integrated battery backup for multiple field measurement devices
     Nemo Datatest Server 1.0 - engm / sw
     - Linux-based fixed end server for data-testing on cellular networks
     Nemo Voice Quality 1.0 - projm / sw
     - end-to-end method for testing objective voice quality over cellular networks
     EU patent: EP1611756 - planning
     - method, apparatus, computer program product and arrangement for testing radio network data connections
2005 Nemo Audiotest Server 1.0 - projm / planning / sw / hw
     - Linux-based fixed end server for voice quality-testing on cellular networks
2006 Nemo Autonomous - projm / planning / hw / sw
     Nemo Autonomous Server 1.0
     - autonomous cellular field measurement solution with file & fleet managers
2007 Nemo Server 2.0 - engm / planning / hw / sw
2007 Nemo Voice Quality 2.0 - projm / planning / sw
     - improved end-to-end method for testing objective voice quality over cellular networks
2010 Nemo Server 3.0 - engm / planning / hw / sw
2012 Nemo Server 4.0 - prodm / engm / hw / sw
2013 Nemo Autonomous 2.0 - projm / planning
     - autonomous cellular field measurement solution
     Nemo Voice Quality 3.0 - planning
     - PTP time-based end-to-end method for testing objective voice quality over cellular networks
2014 Nemo Server 5.0 - prodm / engm / hw
2014 Nemo Server 5.1 & 5.2 - prodm / engm / hw
2016 Nemo Cloud 1.0 - engm / planning / architect / sw
     - SaaS & on-premise cloud solution for Nemo measurement and post-processing product interconnection
2018 Nemo Cloud 2.0 - planning / architect / presales
     Nemo Continuum - projm / planning / architect
     - realtime communications system for realtime metrics, events, measurement data and command&control
2020 Nemo Server 6.0 - engm / planning
     - virtualized data-test server solution
2021 5G datatest lab - planning / hw
2022 Nemo Cloud 3.0 - architect / presales
     Nemo Cloud devops project - projm
     Nemo Datatest Server 6.1 - engm
     - containerized data-test server solution
2023 Nemo Datatest / VoIP Server 6.2 - engm
     Nemo Core Engine - engm
     - Linux-based measurement engine
     PTP datatest lab - planning / hw
     Siemens Industrial Edge lab - planning / hw
EOF`;

const skillsInfo = `Management
---------------------------------------------------------------------------------------------
Engineering management
	Team leading, building and recruitment
Project management
	Project leading, plans, schedules, cost estimations and administration
Technical product management
	SW architecture and requirements planning and documentation
Pre-sales
	Customer negotiations
Technical lead
	Technical specifications, studies and proof-of-concepts


Soft skills
---------------------------------------------------------------------------------------------
Product- and business-oriented growth mindset
Self-directed with hands-on attitude
Constructive team player
Creative, inventive and adaptive, and constant learner
Problem solver and troubleshooter


Technologies
---------------------------------------------------------------------------------------------
Project management: Atlassian stack Jira Confluence etc
Linux: Debian, Ubuntu, Raspbian, RedHat, CentOS
Linux services: all common net services
Languages from recent to oldest: Python, NodeJS, PHP, Bash, Javascript, CSS, HTML, Perl, C++, C, Assembly
Databases: MySQL, MariaDB, Percona XtraDB, SQLite, Redis, InluxDB
Data formats: xml json yaml csv protobuf ... really any
Message brokers: RabbitMQ, MQTT, AWS SNS, ZeroMQ, Deepstream
Load balancers: HAproxy, Nginx, AWS ELB, F5
Server infra: Dell low/mid/high-tier servers, RAID setups, NAS, SAN/iSCSI, clustering, managed switches
Virtualization: VMware vSphere/vCenter/ESXi/Workstation, Proxmox, VirtualBox, Hyper-V
Cloud providers: Amazon Web Services
Source code management: Bitbucket, Git, Gitlab, Github
Compilation and building: common Linux build tools, containerized builds, Debian and tarball packaging
Deployments and DevOps: Jenkins, Docker, Artifactory, private Docker & Debian repos, AWS EC2/ECR/ECS
Orchestration: Kubernetes, AWS EKS, Terraform, Helm, Ansible
Wireless standards: GSM, WCDMA, LTE, 5G, Wifi, Bluetooth, Z-Wave, ZigBee
Voie Quality measurements: PESQ, POLQA, ViSQOL
Standard office/dev tools: Microsoft Office, Visio, Visual Studio Code
Network protocols: FTP, HTTP, TWAMP, Iperf2, Iperf3, NTP, PTP
Networking troubleshooting: various tools, above average
Misc: LLM's, IoT, REST APIs, OpenAPI/Swagger, OSRM, Wireguard VPN


Hobbies
---------------------------------------------------------------------------------------------
Badminton, cycling, cottage life, stand-up paddleboarding, kayaking, hiking, movies & books,
home automation, coding, construction & renovation, gardening, travel guide

EOF`;

const lorenzInfo = `
// Rotating Lorenz attractor thingy
//
// This is a re-creation of my original demo made in 80's.
// Back then it was coded in assembly for Amiga 500 and PC/486, Motorola MC68k and Intel i486
// respectively, and took few weeks time to finish so that it played perfectly smoothly.
// Those machines were seriously limited by CPU power and all kinds of tricks needed to be utilized,
// like calculating only single new point per loop and using fixed point arithmetics, to name few.
// The task of redrawing and 3D-rotating this many points during each frame refresh (25 fps iirc)
// was huge task alone and the process consumed almost every cycle from the CPU.
//
// Now the coding took less than hour and composes much less code thanks to advanced THREE.js graphics,
// and there is no observable CPU load in the host (less than 1% in single core).
//
// For details see: en.wikipedia.org/wiki/Lorenz_system
//
// Copyright (C) 2024 Jari Kuokkanen / yarik@iki.fi
//`

let terminalLeft, writeSpeedLeft, terminalRight, writeSpeedRight;
let buttonMenuEnabled, buttonGroup;
let inactivityTimeout;
const inactivityTimeoutValue = 2000; // 10s


window.addEventListener('load', init);

function init() {

    writeSpeedLeft = 8;
    writeSpeedRight = 0;
    terminalLeft = document.getElementById("terminal");
    terminalRight = document.getElementById("terminal-right");
    buttonMenuEnabled = true;

    terminalLeft.innerText = terminalPrompt;
    terminalRight.innerText = "";
    terminalStart();

    buttonGroup = document.querySelector('.menu-button-group');

    // Mouse/touch listeners
    document.addEventListener('mousemove', showMenuButtons);
    document.addEventListener('touchmove', showMenuButtons);

    // Key input listener
    terminalLeft.addEventListener('keydown', terminalKeybHandler);

    // Button input listeners
    document.getElementById('button1').addEventListener('click', terminalMouseHandler);
    document.getElementById('button2').addEventListener('click', terminalMouseHandler);
    document.getElementById('button3').addEventListener('click', terminalMouseHandler);
    document.getElementById('button4').addEventListener('click', terminalMouseHandler);
    document.getElementById('button5').addEventListener('click', terminalMouseHandler);
    document.getElementById('button9').addEventListener('click', terminalMouseHandler);
}

function showMenuButtons() {
    buttonGroup.classList.add('menu-button-group-visible');

    // Clear any existing timeout to reset the hiding timer
    clearTimeout(inactivityTimeout);

    // Set a timeout to hide buttons after 10 seconds of inactivity
    inactivityTimeout = setTimeout(() => {
        buttonGroup.classList.remove('menu-button-group-visible');
    }, inactivityTimeoutValue);
}

function terminalStart() {
    terminalWrite(startCommand + selectPrompt, terminalLeft, writeSpeedLeft);
}

function terminalStop() {
    terminalLeft.value = "";
    terminalRight.value = "";
    writeSpeedLeft = 8;
}

function cvOpen() {
    window.open("https://yarik.kapsi.fi/cv.pdf", "", "");
}

function terminalWrite(text, terminal, speed) {
    let counter = 0;
    (function writer() {
        terminalLeft.disabled = true;
        terminalRight.disabled = true;
        buttonMenuEnabled = false;
        if (counter < text.length) {
            let terminalText = (`${(terminal.value).replace("┋", "")}${text.charAt(counter)}`);
            if (counter !== text.length - 1) {
                terminalText = `${terminalText}┋`
            }
            // keyPressAudio.play();
            terminal.scrollTop = terminal.scrollHeight;
            terminal.value = terminalText;
            counter++;
            setTimeout(writer, speed);
        } else {
            clearTimeout(writer);
            buttonMenuEnabled = true;
            terminalLeft.disabled = false;
            terminalLeft.blur();
            terminalLeft.focus();
        }
    })();
}

function terminalKeybHandler(e) {
    terminalInputHandler(e.keyCode);
}

function terminalMouseHandler(e) {
    if (!buttonMenuEnabled) return;
    //console.log('Button was clicked: ', e.target.id);
    keyCode = parseInt(e.target.id.charAt(e.target.id.length - 1)) + 48; // Tiny kludge here :)
    terminalInputHandler(keyCode);
}

function terminalInputHandler(keyCode) {
    //console.log('Key was clicked: ', keyCode);
    switch (keyCode) {
        case 49:    // 1
        case 97:    // numpad 1
            terminalWrite("1\ncat contact-info.txt\n" + contactInfo + selectPrompt, terminalLeft, writeSpeedLeft);
            break;
        case 50:    // 2
        case 98:    // numpad 2
            terminalWrite("2\ncat projects-by-year.txt | write guest pts/1" + selectPrompt, terminalLeft, writeSpeedLeft);
            terminalRight.value = "";
            terminalWrite(projectInfo, terminalRight, writeSpeedRight);
            break;
        case 51:    // 3
        case 99:    // numpad 3
            terminalWrite("3\ncat skills.txt | write guest pts/1" + selectPrompt, terminalLeft, writeSpeedLeft);
            terminalRight.value = "";
            terminalWrite(skillsInfo, terminalRight, writeSpeedRight);
            break;
        case 52:    // 4
        case 100:   // numpad 4
            terminalWrite("4\nwget -qO- https://yarik.kapsi.fi/cv.pdf | xdg-open /dev/stdin" + selectPrompt, terminalLeft, writeSpeedLeft);
            setTimeout(() => cvOpen(), 2000);
            break;
        case 53:    // 5
        case 101:   // numpad 5
            terminalWrite("5\nawk -v RS= NR==1 assets/lorenz-code.js | write guest pts/1" + selectPrompt, terminalLeft, writeSpeedLeft);
            terminalRight.value = "";
            terminalWrite(lorenzInfo, terminalRight, writeSpeedRight);
            break;
        case 57:    // 9
        case 105:   // numpad 9
            writeSpeedLeft = 64;
            terminalWrite("9\n\n" + terminalPrompt + "exit\n", terminalLeft, writeSpeedLeft);
            setTimeout(() => terminalStop(), 4000);
            break;
        case 71:    // g
            terminalWrite("q\nNo, press the other q\n", terminalLeft, writeSpeedLeft);
            break;
        case 81:    // q
            terminalWrite("q\nTry pressing sequence: Esc : q !\n", terminalLeft, writeSpeedLeft);
            break;
        default:
            //e.preventDefault();
            terminalWrite("\nSyntax error." + selectPrompt, terminalLeft, writeSpeedLeft);
    }
}


