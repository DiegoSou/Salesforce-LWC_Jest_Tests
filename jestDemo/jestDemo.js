import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/JestDemoController.getAccounts';
import { CurrentPageReference } from 'lightning/navigation';
import getCases from '@salesforce/apex/JestDemoController.getCases';

const exitingStuff = [
    {
        id: '1',
        name: 'basket of carrots',
        quantity: 2
    },
    {
        id: '2',
        name: 'combat tools',
        quantity: 5
    },
    {
        id: '3',
        name: 'chic foods',
        quantity: 4
    },
]

export default class JestDemo extends LightningElement 
{
    @wire(CurrentPageReference) currentPage;
    @wire(getAccounts) wiredAccounts;

    someStuffAsParagraph = 'Some exiting stupid stuff!';
    showNewParagraph = false;

    imperativeCases;
    imperativeCasesErrors;

    get someExitingStuff() 
    {
        return exitingStuff;
    }

    rederNewParagraph()
    {
        this.showNewParagraph = true;
    }

    connectedCallback()
    {
        getCases()
        .then((data) => {
            this.imperativeCases = data;
        })
        .catch((e) => {
            console.log(e);
        });
    }
}