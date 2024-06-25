const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');


const languageStrings = {
  en: {
    translation: {
      WELCOME_MESSAGE: 'Welcome to Unit Conversion! You can convert between different metric units by saying something like "convert 5 kilometers to meters". If you need help with the phrases to interact with the skill, say "help". To stop, simply say "Cancel!"',
      HELP_MESSAGE: 'You can ask for unit conversion, phrases you can use include "convert 5 kilometers to meters", "convert 10 meters to centimeters", "convert 2.5 feet to meters", and so on. How can I help you?',
      GOODBYE_MESSAGE: 'Goodbye!',
      FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
      ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
      GET_FRASES_MSG: 'Here is the conversion result: ',
      OtroDato: '... You can request another conversion by saying, "convert another unit" or if you need help with the phrases to interact with the skill, say "help". To stop, simply say "Cancel!"'
    }
  },
  es: {
    translation: {
      WELCOME_MESSAGE: '¡Bienvenido a Conversión de Unidades! Puedes convertir entre diferentes unidades métricas diciendo algo como "convierte 5 kilómetros a metros". Si necesitas ayuda con las frases para interactuar con la skill, di "ayuda". Para detener, simplemente di "¡Cancelar!"',
      HELP_MESSAGE: 'Puedes pedir una conversión de unidades, frases que puedes ocupar "convierte 5 kilómetros a metros", "convierte 10 metros a centímetros", "convierte 2.5 pies a metros", y así sucesivamente. Cómo te puedo ayudar?',
      GOODBYE_MESSAGE: '¡Adiós!',
      FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor intenta de nuevo.',
      ERROR_MESSAGE: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
      GET_FRASES_MSG: 'Aquí está el resultado de la conversión: ',
      OtroDato: '... Puedes pedir otra conversión diciendo, "convierte otra unidad" o si necesitas ayuda con las frases para interactuar con la skill, di "ayuda". Para detener, simplemente di "¡Cancelar!"',
    }
  }
}

function convertUnits(value, fromUnit, toUnit) {
    let convertedValue;
    let convertedUnit;
    
    // Convert from fromUnit to a common unit (meters)
    let meters;
    switch (fromUnit.toLowerCase()) {
        case 'km':
        case 'kilometers':
        case 'kilometros':
            meters = value * 1000;
            break;
        case 'm':
        case 'meters':
        case 'metros':
            meters = value;
            break;
        case 'cm':
        case 'centimeters':
        case 'centimetros':
            meters = value / 100;
            break;
        case 'mi':
        case 'miles':
        case 'millas':
            meters = value * 1609.34;
            break;
        case 'ft':
        case 'feet':
        case 'pies':
            meters = value / 3.28084;
            break;
        case 'in':
        case 'inches':
        case 'pulgadas':
            meters = value / 39.3701;
            break;
        default:
            return null;
    }

    // Convert from meters to toUnit
    switch (toUnit.toLowerCase()) {
        case 'km':
        case 'kilometers':
        case 'kilometros':
            convertedValue = meters / 1000;
            convertedUnit = toUnit;
            break;
        case 'm':
        case 'meters':
        case 'metros':
            convertedValue = meters;
            convertedUnit = toUnit;
            break;
        case 'cm':
        case 'centimeters':
        case 'centimetros':
            convertedValue = meters * 100;
            convertedUnit = toUnit;
            break;
        case 'mi':
        case 'miles':
        case 'millas':
            convertedValue = meters / 1609.34;
            convertedUnit = toUnit;
            break;
        case 'ft':
        case 'feet':
        case 'pies':
            convertedValue = meters * 3.28084;
            convertedUnit = toUnit;
            break;
        case 'in':
        case 'inches':
        case 'pulgadas':
            convertedValue = meters * 39.3701;
            convertedUnit = toUnit;
            break;
        default:
            return null;
    }

    return { value: convertedValue, unit: convertedUnit };
}
// Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    } 
};


const ConvertUnitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertUnitIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const value = parseFloat(slots.Value.value);
        const fromUnit = slots.FromUnit.value.toLowerCase();
        const toUnit = slots.ToUnit.value.toLowerCase();

        let result = convertUnits(value, fromUnit, toUnit);

        let speakOutput;
        if (result) {
            speakOutput = locale.startsWith('es')
                ? `${value} ${fromUnit} son aproximadamente ${result.value.toFixed(2)} ${result.unit}. ¿Quieres hacer otra conversión?`
                : `${value} ${fromUnit} are approximately ${result.value.toFixed(2)} ${result.unit}. Would you like to make another conversion?`;
        } else {
            speakOutput = locale.startsWith('es')
                ? 'Lo siento, no puedo convertir esas unidades. ¿Te gustaría intentar otra conversión?'
                : 'Sorry, I can\'t convert those units. Would you like to try another conversion?';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};




const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? `Acabas de activar ${intentName}`
            : `You just triggered ${intentName}`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};


// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}




exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    
    .lambda();