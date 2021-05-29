# Capernaum Architecture Notes

Some notes and UML diagrams
about the architecture of Capernaum,
particularly on the server side.

## Structure of Analytical Data

- `PTE`: Page Table Entry
- `SEP`: Scripture Engagement Practice

```puml
@startmindmap
* Survey

** Survey Dimension
*** Survey Index
**** Survey Item
**** Survey Item
**** Survey Item
*** Survey Index
**** Survey Item
**** PTE
***** SEP
**** PTE
***** SEP

** Survey Dimension
*** Survey Index
**** Survey Item
**** Survey Item
**** PTE
***** SEP
*** Survey Index
**** Survey Item
**** Survey Item
**** PTE
***** SEP
**** PTE
***** SEP
@endmindmap
```

## Key Classes

Yes, type declarations are backwards from UML standard,
but they make more sense for TypeScript.

```puml
@startuml

hide empty members

package letter {
    class Letter
    class LetterElement
    Letter *-- LetterElement
}

package survey {
    class Survey {
        surveyDimensions: SurveyDimension[]
        surveyItems: SurveyItem[]
        surveyResponses: SurveyResponse[]
    }

    class SurveyItem {
        survey: Survey
        surveyIndex: SurveyIndex
    }

    class SurveyResponse {
        survey: Survey
        group: Group
        + predictScriptureEngagement(): Prediction[]
        + summarize(): ResponseSummary
    }
    Survey "1" o-- "n" SurveyResponse

    class SurveyItemResponse {
        surveyResponse: SurveyResponse
        surveyItem: SurveyItem
        label: string
        value: number
    }
    SurveyItemResponse "n" -- "1" SurveyResponse
    SurveyItemResponse "n" -- "1" SurveyItem

    class SurveyDimension {
        survey: Survey
        title: string
        surveyIndices: SurveyIndex[]
        + chartData(): ChartData
    }

    class SurveyIndex {
        useForPredictions: boolean
        surveyItems: SurveyItem[]
        predictionTableEntries: PredictionTableEntry[]
    }

    Survey "1" *-- "n" SurveyDimension
    Survey "1" *-- "n" SurveyItem
    SurveyDimension "1" *-- "n" SurveyIndex
    SurveyIndex "1" o-- "n" SurveyItem
}

package prediction {
    class PredictionTableEntry {
        letter: Letter
        practice: ScriptureEngagementPractice
    }

    class ScriptureEngagementPractice {
        label: string
        description: string
        moreInfoURL: string
    }

    PredictionTableEntry "n" --o "1" ScriptureEngagementPractice
}

package writer {
    class LineBuffer
    class Writer {
        + renderLetter(letterId, surveyResponseId)
        - renderAllElements(letter, surveyResponse)
        - runLaTeX(renderedElements, letter, surveyResponse)
    }
}

Letter "n" -- "1" Survey
Letter -- PredictionTableEntry
SurveyIndex "1" *-- "n" PredictionTableEntry
@enduml
```

## How We Render a Letter

This sequence diagram shows how we render a letter.
The `ReportQueueConsumer` class listens on the event queue
for notifications posted by the server in response to
a _survey completed_ event from Qualtrics.

```puml
@startuml
autoactivate on

participant ReportQueueConsumer as rqc
participant QualtricsApiService as qas
participant WriterService as writer
participant LetterService as letter
participant SurveyService as survey
participant SurveyResponse as sr <<Entity>>
participant MailService
participant EventService

[-> rqc: processReport

rqc -> survey: findSurveyByQualtricsId
return survey

rqc -> qas: getOneResponse
    qas -> qas: qualtricsGet
    note right: Qualtrics event sends only response ID.\nGet response itself 
    deactivate qas
return qualtricsResponse

rqc -> survey: importQualtricsSurveyResponse
note right: Store in Capernaum database
return importedResponse

rqc -> writer: renderLetter(letterId, surveyResponseId)
    writer -> letter: findLetter
    return letter
    
    writer -> survey: surveyResponseComplete
    return surveyResponse
    note right
    "Complete" response with everything
    needed to write the letter 
    end note
    
    writer -> writer: renderAllElements
        group scripture engagement
            writer -> sr: predictScriptureEngagement
            return predictions
            writer -> writer: renderPredictions
            deactivate
        end

        group dimension bar chart
            writer -> sr: findDimensionById
            return predictions
            writer -> writer: renderChart
            deactivate
        end
        
        group other
        writer -> writer: (other elements)
        deactivate
        end
    deactivate

    writer -> writer ++: runLaTeX
    deactivate
return writerOutput

rqc -> MailService ++: sendMail
return mailInfo

rqc -> EventService ++: createEvent
return (void)

@enduml
```
