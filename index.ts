import { ofType } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';
import { isEqual } from 'lodash';
import { of, map, Observable, catchError } from 'rxjs';

type ExampleAction = ActionWithNumber | ActionWithString;

interface ActionWithNumber {
  type: 'ActionWithNumber';
  content: number;
}
interface ActionWithString {
  type: 'ActionWithString';
  content: string;
}

const exampleEpic$ = (action$: Observable<ExampleAction>) =>
  action$.pipe(
    ofType<ExampleAction, 'ActionWithNumber'>('ActionWithNumber'),
    map(({ content }) => {
      console.log('content', content);
      return content + content;
    }),
    catchError((err, err$) => {
      console.error('error', err);
      return err$;
    })
  );

const testScheduler = new TestScheduler((actual, expected) => {
  const status = isEqual(actual, expected);
  console.log('TestScheduler', status, { actual, expected });
});

testScheduler.run(({ expectObservable }) => {
  const input$ = of({ type: 'ActionWithNumber' as const, content: 128 });
  const expected = '(a|)';
  const output$ = exampleEpic$(input$);
  expectObservable(output$).toBe(expected, { a: 256 });
});
