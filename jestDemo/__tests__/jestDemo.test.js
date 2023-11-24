import { createElement } from 'lwc';
import getAccounts from '@salesforce/apex/JestDemoController.getAccounts';
import JestDemo from '../jestDemo';
import { setImmediate } from 'timers';
import { CurrentPageReference } from 'lightning/navigation';
import getCases from '@salesforce/apex/JestDemoController.getCases';

// mock data
const mockWiredAccounts = require('./mockData/wiredAccounts.json');
const accountRecordPageReference = require('./mockData/accountRecordPageReference.json');
const mockWiredCases = require('./mockData/imperativeCases.json');
// jest.mock(moduleName: string, factoryMethod?: func, options?)
jest.mock(
    '@salesforce/apex/JestDemoController.getAccounts',
    () => {
        const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

jest.mock(
    '@salesforce/apex/JestDemoController.getCases',
    () => {
        return { default:jest.fn() }
    },
    { virtual: true }
);

// start describing tests
describe('Positive test!', () => {
        
    beforeEach(async () => {
        getCases.mockResolvedValue(mockWiredCases);

        const jestDemoCmp = createElement('c-jest-demo', { is: JestDemo });
        document.body.appendChild(jestDemoCmp);
        
        // mocks
        await new Promise(async (res, rej) => {
            getAccounts.emit(mockWiredAccounts);
            await new Promise(setImmediate).then(() => {
                res();
            });
        });
    });

    afterEach(() => {
        while (document.body.firstChild)
        {
            document.body.removeChild(document.body.firstChild);
        }
    });

    //
    // Tests
    //

    test('Some exiting stupid stuff paragraph exists',
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');

            const paragraphText = jestDemoCmp.shadowRoot.querySelector('p');

            // expects
            expect(paragraphText.textContent).toBe('Some exiting stupid stuff!');
        }
    );

    test('Shows new exiting stuff paragraph onclick',
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');
            const button = jestDemoCmp.shadowRoot.querySelector('.paragraphRenderButton');
            const newParagraph = jestDemoCmp.shadowRoot.querySelector('.newParagraph');

            // expects
            expect(newParagraph).toBeNull();

            button.dispatchEvent(new CustomEvent('click'));
            Promise.resolve().then(
                () => {
                    const newParagraph = jestDemoCmp.shadowRoot.querySelector('.newParagraph');

                    // expects
                    expect(newParagraph.textContent).toBe('Wow I love new stuff');
                },
                () => {
                    console.log('Rejected');
                }
            );
        }
    );

    test('Comply with exiting stuff items',
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');
            const stuffInfos = jestDemoCmp.shadowRoot.querySelectorAll('.stuffInfo');

            const stuffArray = Array.from(stuffInfos);
            const stuffParagraphContents = stuffArray.map(stuffInfo => stuffInfo.textContent);

            // expects
            expect(stuffParagraphContents.length).toBe(3);
            expect(stuffParagraphContents).toEqual([
                "Stuff by name: basket of carrots, index 0",
                "Stuff by name: combat tools, index 1",
                "Stuff by name: chic foods, index 2"
            ]);
        }
    );

    test('Wire accounts correctly',
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');

            const accountArray = Array.from(jestDemoCmp.shadowRoot.querySelectorAll('.accountInfo'));
            const accountNameArray = accountArray.map((div) => div.textContent);

            // expects
            expect(accountNameArray.length).toBe(5);
            expect(accountNameArray).toEqual([
                "Get Cloudy South",
                "Sample Account for Entitlements",
                "Edge Communications",
                "Burlington Textiles Corp of America",
                "Pyramid Construction Inc."
            ]);
        }
    );
    
    test('Current page wire', 
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');
            const currPageDiv = jestDemoCmp.shadowRoot.querySelector('.currentPageReference');

            // expects
            expect(currPageDiv.textContent).toEqual("");

            CurrentPageReference.emit(accountRecordPageReference);

            return new Promise(setImmediate).then(() => {
                const currPageDiv = jestDemoCmp.shadowRoot.querySelector('.currentPageReference');

                // expects
                expect(currPageDiv.textContent).not.toEqual("");
            });
        }
    );

    // test('Imperative get cases apex call', 
    //     () => {
    //         const jestDemoCmp = document.querySelector('c-jest-demo');

    //         const casesInfoDivList = jestDemoCmp.shadowRoot.querySelectorAll('.caseInfoDiv');

    //         // expects
    //         expect(casesInfoDivList.length).toBe(5);
    //     }
    // );

    test('Child component case data',
        () => {
            const jestDemoCmp = document.querySelector('c-jest-demo');
            const jestDemoChildCmp = jestDemoCmp.shadowRoot.querySelector('c-jest-demo-child');
            
            const casesInfos = Array.from(jestDemoChildCmp.shadowRoot.querySelectorAll('.caseInfoDiv'));
            const caseNames = casesInfos.map((elementDiv) => {
                const elementP = elementDiv.querySelector('p');

                return elementP.textContent;
            });

            // expects
            expect(caseNames.length).toBe(5);
            expect(caseNames).toEqual([
                "Renew Warranty",
                "CC overpayment not refunded",
                "Laptop not working",
                "Laptop Power",
                "Laptop not working"
            ]);
        }
    );

});