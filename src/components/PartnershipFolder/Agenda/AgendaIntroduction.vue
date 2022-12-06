<template>
    <b-container fluid v-if="identity.allowedToEdit" id="agenda__introduction">
        <b-row>
            <b-col>
                <h5>Préambule : bonnes pratiques</h5>
                <p>Lors de votre prise de brief, soyez directif dans la manière de présenter le paramétrage d'une solution de prise de RDV à nos partenaires. Nos expériences montrent que nous pouvons verticaliser le paramétrage des modules de réservation. Les différents documents en liens ci-dessous vous permettront de visualiser différents modèles de modules de réservations. Ces liens sont là pour vous aider à recueillir plus facilement les besoins des partenaires (en les guidant et en mettant en avant notre expérience sur ce sujet).
                </p>
                <ul>
                    <li class="agenda__list mb-2">Vidéos tutos : <a href="https://www.agendize.com/fr/tutoriel-video" target="_blank" class="agenda__external__link">https://www.agendize.com/fr/tutoriel-video</a>
                        <br>
                        <i class="far fa-question-circle"></i> Tutoriels permettant d'apprendre rapidement et simplement les principaux aspects de la plateforme Agendize.
                    </li>
                    <li class="agenda__list mb-2">Vidéos cas pratiques : <a href="https://www.agendize.com/fr/cas-pratique" target="_blank" class="agenda__external__link">https://www.agendize.com/fr/cas-pratique</a>
                        <br>
                        <i class="far fa-question-circle"></i> Vidéos permettant de voir comment un internaute pourra prendre son RDV en ligne.
                    </li>
                    <li class="agenda__list mb-2">Accès à des modules classés par typologie clients : <a href="https://docs.google.com/spreadsheets/d/1xzGYQmrIYHH6HrPNiQ48mU9H8yf0A_8ZfIFxw2sNuxA/edit?usp=sharing" target="_blank" class="agenda__external__link">https://docs.google.com/spreadsheets/d/1xzGYQmrIYHH6HrPNiQ48mU9H8yf0A_8ZfIFxw2sNuxA/edit?usp=sharing</a>
                        <br>
                        <i class="far fa-question-circle"></i> Ces exemples de comptes sont à utiliser en amont de vos appels pour vous permettre d’avoir des exemples de modules paramétrés en fonction de l’activité du professionnel.
                        <br>
                    </li>
                </ul>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "AgendaIntroduction",
    computed: {
        ...mapState('account', ['identity'])
    },
}
</script>
