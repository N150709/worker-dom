/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach(t => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('removeChild mutation observed, first node', t => {
  const { document } = t.context;
  const div = document.createElement('div');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.removeChild(div);
});

test.serial.cb('removeChild mutation observed, sibling node', t => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  document.body.appendChild(p);
  observer.observe(document.body);
  document.body.removeChild(div);
});

test.serial.cb('removeChild mutation observed, multiple sibling nodes', t => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  const input = document.createElement('input');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [input],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  document.body.appendChild(p);
  document.body.appendChild(input);
  observer.observe(document.body);
  document.body.removeChild(div);
  document.body.removeChild(input);
});

test.serial.cb('removeChild mutation observed, tree > 1 depth', t => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: div,
          removedNodes: [p],
        },
      ]);
      observer.disconnect();
      t.end();
    },
  );

  document.body.appendChild(div);
  div.appendChild(p);
  observer.observe(document.body);
  div.removeChild(p);
});
