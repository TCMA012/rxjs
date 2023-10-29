/*
https://stackoverflow.com/questions/61274166/test-angular-reactive-forms-using-rxjs-marbles
the question is - what you want to test. is it a unit test or an e2e test? if it's a unit test - mock reactive forms, cover only your logic, then you don't have an issue with valueChanges, because it's mocked and you control it.

if it's an e2e test - you shouldn't reassign valueChanges. Nothing should be mocked / replaced, because it's an e2e test.

Nevertheless if you want to change valueChanges - use 
https://github.com/krzkaczor/ts-essentials#writable

(Writable<typeof component.formField>component.formField).valueChanges = fakeInputs; 
It will make the property type writable.

If it's a unit test, personally, I would vote to mock the reactive form, because in a unit test we need to test only our unit, its dependencies should be mocked / stubbed.

Injection of parts we want to mock

As an option you can move the form as a dependency of your component to providers in the component declarations.
*/
@Component({
    selector: 'app-component',
    templateUrl: './app-component.html',
    styleUrls: ['./app-component.scss'],
    providers: [
        {
            provide: 'form',
            useFactory: () => new FormControl(),
        },
    ],
})
export class AppComponent {
    public formFieldChanged$: Observable<unknown>;

    constructor(@Inject('form') public readonly formField: FormControl) {
    }

    public setupObservables(): void {
        this.formFieldChanged$ = this.formField
            .valueChanges
            .pipe(
                debounceTime(100),
                distinctUntilChanged((a, b) => a === b),
            );
    }
}
//you can simply inject a mock instead of it in a test.

it('should update value on debounced formField change', marbles(m => {
    const values = { a: "1", b: "2", c: "3" };

    const fakeInputs = m.cold('a 200ms b 50ms c', values);
    const expected = m.cold('100ms a 250ms c', values);

    const formInput = {
        valueChanges: fakeInputs,
    };

    const component = new AppComponent(formInput as any as FormControl);

    component.setupObservables();
    m.expect(component.formFieldChanged$).toBeObservable(expected);
}));