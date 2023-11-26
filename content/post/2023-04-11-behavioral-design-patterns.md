+++
title = "Object oriented design patterns - Behavioral patterns (Part 3)"
description = "The Gang of Four's classic behavioral design patterns."
author = "Morten Dæhli Aslesen"
date = 2023-04-11T15:03:00.000Z
tags = ["software design", "object-oriented programming"]
draft = false
+++

This is the third and last part in a series of 3 blog post summarizing the famous 
by Gamma, Helm, Johnson and Vlissides, also known as the Gang of Four.

## Behavioral Pattern
Behavioral design patterns in software development are design patterns that focus on the communication between objects
and how they interact to achieve a specific behavior or functionality. These patterns are concerned with the
interactions and responsibilities of objects, and how they work together to accomplish a common goal.

### Chain of Responsibility Pattern
The Chain of Responsibility pattern allows a group of objects to handle a request in a chain-like sequence.
When a request is made, it is passed through the chain of objects until one of them handles the request.
Each object in the chain has the option to handle the request or pass it on to the next object in the chain.
This allows for more flexibility in handling requests, as well as reducing coupling between objects.

The Chain of Responsibility Pattern consists of the following components:
- **Handler**: Defines an interface for handling requests and optionally implements the successor link to the next
  handler in the chain.
- **ConcreteHandler**: Implements the Handler interface and handles requests that it is responsible for. If it cannot
  handle the request, it passes it on to the next handler in the chain.
- **Client**: Initiates the request to the first handler in the chain.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Optional


class Handler(ABC):
    def __init__(self, successor: Optional[Handler] = None):
        self._successor = successor

    def handle(self, request: str) -> None:
        handled = self.process(request)

        if not handled:
            if self._successor:
                self._successor.handle(request)
            else:
                print(f"Request: {request} did not get handled by the chain of responsibility.")

    @abstractmethod
    def process(self, request) -> bool:
        ...

class ConcreteHandlerA(Handler):
    def process(self, request) -> bool:
        if request == 'request1':
            print("Handling request 1")
            return True

class ConcreteHandlerB(Handler):
    def process(self, request) -> bool:
        if request == 'request2':
            print("Handling request 2")
            return True

class ConcreteHandlerC(Handler):
    def process(self, request) -> bool:
        if request == 'request3':
            print("Handling request 3")
            return True

class Client:
    def __init__(self):
        self.handler = ConcreteHandlerA(ConcreteHandlerB(ConcreteHandlerC()))

    def make_request(self, request):
        self.handler.handle(request)

def main():
    client = Client()
    client.make_request('request1')
    client.make_request('request2')
    client.make_request('request3')
    client.make_request('request4')

if __name__ == "__main__":
    main()
```

This will output:
```text
Handling request 1
Handling request 2
Handling request 3
Request: request4 did not get handled by the chain of responsibility.
```

### Command Pattern
The Command pattern is a behavioral design pattern that encapsulates a request as an object, thereby letting you
parameterize clients with different requests, queue or log requests, and support undoable operations. In other words,
the Command pattern decouples the object that invokes an operation from the one that knows how to perform it.

The Command Pattern consists of the following components:
- **Command**: Defines the interface for executing a command.
- **ConcreteCommand**: Implements the Command interface and defines a binding between a receiver object and an action.
- **Receiver**: Knows how to perform the operations associated with carrying out a request.
- **Invoker**: Holds a command and at some point asks the command to carry out a request.
```python
from __future__ import annotations
from abc import ABC, abstractmethod


class Command(ABC):

    @abstractmethod
    def execute(self) -> None:
        ...


class SimpleCommand(Command):

    def __init__(self, receiver: Receiver) -> None:
        self._receiver = receiver

    def execute(self) -> None:
        print(f"SimpleCommand: executing using {self._receiver.__class__.__name__}")
        self._receiver.do_something_simple()


class ComplexCommand(Command):
    def __init__(self, receiver: Receiver, a: str, b: str) -> None:
        self._receiver = receiver
        self._a = a
        self._b = b

    def execute(self) -> None:
        print(f"ComplexCommand: executing a more complex command using {self._receiver.__class__.__name__}")
        self._receiver.do_something_complex(self._a)
        self._receiver.do_something_else_complex(self._b)


class Receiver:
    def do_something_simple(self):
        print(f"{self.__class__.__name__} doing something simple.")

    def do_something_complex(self, a: str) -> None:
        print(f"{self.__class__.__name__} doing something complex with variable {a}")

    def do_something_else_complex(self, b: str) -> None:
        print(f"{self.__class__.__name__} doing something else complex with variable {b}")

class Invoker:
    _on_start = None
    _on_finish = None

    def set_on_start(self, command: Command):
        self._on_start = command

    def set_on_finish(self, command: Command):
        self._on_finish = command

    def execute(self) -> None:
        if isinstance(self._on_start, Command):
            self._on_start.execute()

        if isinstance(self._on_finish, Command):
            self._on_finish.execute()


def main():
    invoker = Invoker()
    receiver = Receiver()
    invoker.set_on_start(SimpleCommand(receiver))
    invoker.set_on_finish(ComplexCommand(receiver, "a", "b"))
    invoker.execute()

if __name__ == "__main__":
    main()
```

This will output:
```text
SimpleCommand: executing using Receiver
Receiver doing something simple.
ComplexCommand: executing a more complex command using Receiver
Receiver doing something complex with variable a
Receiver doing something else complex with variable b
```

### Interpreter Pattern
The Interpreter pattern defines a grammar for a language and provides an interpreter
to interpret and execute expressions in that language. The pattern is useful when there is a need to evaluate
expressions or parse complex grammars.

The Interpreter Pattern consists of the following components:
- **AbstractExpression**: Defines an interface for interpreting expressions.
- **TerminalExpression**: Implements the AbstractExpression interface and represents a terminal expression in the
  grammar.
- **NonterminalExpression**: Implements the AbstractExpression interface and represents a non-terminal expression in
  the grammar.
- **Context**: Contains information that is global to the interpreter.


```python
from abc import ABC, abstractmethod

class Context:
    def __init__(self):
        self.stack = []

    def push(self, value):
        self.stack.append(value)

    def pop(self):
        return self.stack.pop()

class AbstractExpression(ABC):
    @abstractmethod
    def interpret(self, context: Context):
        ...

class Number(AbstractExpression):
    # Terminal Expression

    def __init__(self, value):
        self.value = int(value)

    def interpret(self, context: Context):
        context.push(self.value)
        return self.value

    def __repr__(self):
        return str(self.value)

class Add(AbstractExpression):
    # Non-Terminal Expression

    def __init__(self, left, right):
        self.left = left
        self.right = right

    def interpret(self, context: Context):
        left = self.left.interpret(context)
        right = self.right.interpret(context)
        result = left + right
        context.push(result)
        return result

    def __repr__(self):
        return f"{self.left} + {self.right}"

class Subtract(AbstractExpression):
    # Non-Terminal Expression

    def __init__(self, left, right):
        self.left = left
        self.right = right

    def interpret(self, context: Context):
        left = self.left.interpret(context)
        right = self.right.interpret(context)
        result = left - right
        context.push(result)
        return result

    def __repr__(self):
        return f"{self.left} - {self.right}"


def main():
    context = Context()

    expressions = [
        Number(7),  # 7
        Number(5),  # 5
        Add(Number(3), Number(2)),  # 3 + 2 = 5
        Subtract(Number(7), Number(5)),  # 7 - 5 = 2
        Add(Number(3), Subtract(Number(2), Number(1)))  # 3 + (2 - 1) = 4
    ]

    for expression in expressions:
        result = expression.interpret(context)
        print(f"Expression: {expression} evaluates to ", result)

if __name__ == "__main__":
    main()
```

This will output:
```text
Expression: 7 evaluates to  7
Expression: 5 evaluates to  5
Expression: 3 + 2 evaluates to  5
Expression: 7 - 5 evaluates to  2
Expression: 3 + 2 - 1 evaluates to  4
```

### Iterator Pattern
The Iterator pattern is a behavioral design pattern that provides a way to access the elements of an aggregate object
sequentially without exposing its underlying representation. This pattern decouples the collection from the traversal
logic and offers a standardized way to cycle through elements of the collection without needing to understand its
internal structure. It's especially useful in cases where a collection has a complex structure, but you want to hide
this complexity from the client. Note that this is already a built in feature in Python classes by if you define
__next__ and __iter__ methods.

The Iterator Pattern consists of the following components:
- **Iterator**: An interface or abstract class that specifies methods for accessing and traversing elements.
- **Concrete Iterator**: Implements the Iterator interface and keeps track of the current position in the traversal of the aggregate object.
- **Aggregate**: An interface which declares the creation of the iterator object.
- **Concrete Aggregate**: Implements the Aggregate interface and returns an instance of the Concrete Iterator.

```python
from abc import ABC
from typing import Any, Sequence


class Iterator(ABC):
    def next(self) -> Any:
        pass

    def has_next(self) -> bool:
        pass


class ConcreteIterator(Iterator):
    def __init__(self, collection: Sequence) -> None:
        self._collection = collection
        self._index = 0

    def next(self) -> Any:
        if self.has_next():
            item = self._collection[self._index]
            self._index += 1
            return item
        raise StopIteration

    def has_next(self) -> bool:
        return self._index < len(self._collection)


class Aggregate:
    def create_iterator(self):
        pass


class ConcreteAggregate(Aggregate):
    def __init__(self, collection) -> None:
        self._collection = collection

    def create_iterator(self) -> ConcreteIterator:
        return ConcreteIterator(self._collection)


if __name__ == "__main__":
    collection = ConcreteAggregate(['Item 1', 'Item 2', 'Item 3'])
    iterator = collection.create_iterator()

    while iterator.has_next():
        print(iterator.next())

```

This will output:
```text
Item 1
Item 2
Item 3
```

### Mediator Pattern
The Mediator pattern is a behavioral design pattern that enables a set of objects to communicate with each other
through a mediator object. This pattern reduces direct communications between objects and makes their interaction
easier to manage and extend. It's particularly useful in scenarios where multiple objects need to work together,
but direct references between them would lead to a tightly-coupled system that's hard to maintain and understand.
The mediator acts as a central hub for interaction, facilitating the exchange of messages or data between objects.

The Mediator Pattern consists of the following components:
- **Mediator**: An interface that defines the methods used for communication between various components.
- **Concrete Mediator**: Implements the Mediator interface and coordinates communication between various components.
  It knows all the components and acts as a router of messages.
- **Component**: A class that communicates with other components through the mediator instead of direct references.

```python
class Mediator:
    def notify(self, sender, event):
        pass


class ConcreteMediator(Mediator):
    def __init__(self, component1, component2):
        self._component1 = component1
        self._component1.mediator = self
        self._component2 = component2
        self._component2.mediator = self

    def notify(self, sender, event):
        if event == "A":
            print("Mediator reacts on A and triggers following operations:")
            self._component2.do_c()
        elif event == "D":
            print("Mediator reacts on D and triggers following operations:")
            self._component1.do_b()


class BaseComponent:
    def __init__(self, mediator=None):
        self._mediator = mediator

    @property
    def mediator(self):
        return self._mediator

    @mediator.setter
    def mediator(self, mediator):
        self._mediator = mediator

class Component1(BaseComponent):
    def do_a(self):
        print("Component 1 does A.")
        self.mediator.notify(self, "A")

    def do_b(self):
        print("Component 1 does B.")


class Component2(BaseComponent):
    def do_c(self):
        print("Component 2 does C.")

    def do_d(self):
        print("Component 2 does D.")
        self.mediator.notify(self, "D")


if __name__ == "__main__":
    c1 = Component1()
    c2 = Component2()
    mediator = ConcreteMediator(c1, c2)

    print("Client triggers operation A.")
    c1.do_a()

    print("\nClient triggers operation D.")
    c2.do_d()

```

This will output:
```text
Client triggers operation A.
Component 1 does A.
Mediator reacts on A and triggers following operations:
Component 2 does C.

Client triggers operation D.
Component 2 does D.
Mediator reacts on D and triggers following operations:
Component 1 does B.
```

### Memento Pattern
The Memento pattern is a behavioral design pattern that allows an object to save its state and restore it later,
without revealing the details of its implementation. This pattern is particularly useful for implementing features like
undo mechanisms or for saving and restoring the state of an object at a particular point in time. It helps in
maintaining high encapsulation levels as the internal state of an object is not exposed outside, yet can be saved externally.

The Memento Pattern consists of the following components:
- **Memento**: A class that stores the internal state of the Originator object. It should have two interfaces; one for
  the caretaker (which is usually wide) and one for the originator (which is narrow and allows the originator to access
  any necessary properties).
- **Originator**: The class of which the state is to be saved. It creates a memento containing a snapshot of its current
  internal state and can also use the memento to restore its internal state.
- **Caretaker**: Responsible for the safekeeping of the memento. It can request a memento from the originator and store
  it for future use. The caretaker, however, must not modify or operate on the contents of the memento.

```python
class Memento:
    def __init__(self, state):
        self._state = state

    def get_saved_state(self):
        return self._state


class Originator:
    _state = ""

    def set(self, state):
        print(f"Originator: Setting state to {state}")
        self._state = state

    def save_to_memento(self):
        print("Originator: Saving to Memento.")
        return Memento(self._state)

    def restore_from_memento(self, memento):
        self._state = memento.get_saved_state()
        print(f"Originator: State after restoring from Memento: {self._state}")


class Caretaker:
    _saved_states = []

    def add_memento(self, memento):
        self._saved_states.append(memento)

    def get_memento(self, index):
        return self._saved_states[index]


if __name__ == "__main__":
    originator = Originator()
    caretaker = Caretaker()

    originator.set("State1")
    caretaker.add_memento(originator.save_to_memento())

    originator.set("State2")
    caretaker.add_memento(originator.save_to_memento())

    originator.set("State3")
    caretaker.add_memento(originator.save_to_memento())

    originator.restore_from_memento(caretaker.get_memento(1))
```

This will output:
```text
Originator: Setting state to State1
Originator: Saving to Memento.
Originator: Setting state to State2
Originator: Saving to Memento.
Originator: Setting state to State3
Originator: Saving to Memento.
Originator: State after restoring from Memento: State2
```

### Observer Pattern
The Observer pattern is a fundamental behavioral design pattern that establishes a one-to-many relationship between
objects. It allows an object, known as the subject, to notify a set of observers about any changes in its state.
This pattern is essential in scenarios where a change in one object requires changing others, and it particularly
shines in cases where the number of dependent objects is unknown or dynamic. It ensures a high degree of separation and
decoupling between the subject and observers, promoting modular code.

The Observer Pattern consists of the following components:
- **Subject**: Maintains a list of observers and provides methods to attach or detach observers to it. It notifies the
  observers about any state changes.
- **Observer**: An interface or abstract class with a method to update the observer, which gets called by the subject
  it is observing.
- **Concrete Observer**: Implements the Observer interface and maintains a reference to a concrete subject. It
  implements the update method to react to state changes in the subject.

```python
class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer):
        try:
            self._observers.remove(observer)
        except ValueError:
            pass

    def notify(self):
        for observer in self._observers:
            observer.update(self)

            
class Observer:
    def update(self, subject):
        pass

    
class ConcreteObserverA(Observer):
    def update(self, subject):
        if subject.state < 3:
            print("ConcreteObserverA: Reacted to the event")

            
class ConcreteObserverB(Observer):
    def update(self, subject):
        if subject.state >= 3:
            print("ConcreteObserverB: Reacted to the event")

            
class ConcreteSubject(Subject):
    _state = 0

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, val):
        self._state = val
        self.notify()

```

This will output:
```text
ConcreteObserverA: Reacted to the event
ConcreteObserverB: Reacted to the event
```

### State Pattern
The State pattern is a behavioral design pattern that allows an object to alter its behavior when its internal state
changes. This pattern is used to encapsulate varying behavior for the same routine, based on the object's state. It's
like having a class change its class. This pattern is particularly useful in scenarios where an object needs to change
its behavior at runtime without changing its class. It helps in organizing the code related to particular state-related
behaviors and allows for adding new states without changing existing state classes or the context.

The State Pattern consists of the following components:
- **Context**: Holds a reference to a state object that defines the current state. The context delegates state-specific
  behavior to the current state object.
- **State**: An interface or abstract class defining the state-specific behavior.
- **Concrete States**: Implement the State interface and provide the implementation for the state-specific behavior.

```python
class State:
    def handle(self, context):
        pass


class ConcreteStateA(State):
    def handle(self, context):
        print("State A handling and switching to State B")
        context.state = ConcreteStateB()


class ConcreteStateB(State):
    def handle(self, context):
        print("State B handling and switching to State A")
        context.state = ConcreteStateA()


class Context:
    def __init__(self, state: State):
        self._state = state

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, state: State):
        self._state = state

    def request(self):
        self._state.handle(self)


if __name__ == "__main__":
    context = Context(ConcreteStateA())

    context.request()  # Handling in State A
    context.request()  # Handling in State B

```

This will output:
```text
State A handling and switching to State B
State B handling and switching to State A
```

### Strategy Pattern
The Strategy pattern allows for selecting algorithms at runtime. It enables an object to change the selected algorithm
at runtime, by using composition to store different strategies and allowing the client to choose between them.

The Strategy Pattern consists of the following components:
- **Context**: This is the class that contains a reference to a Strategy object and provides an interface to the client
  to interact with the Strategy object.
- **Strategy**: This is an interface or abstract class that defines the common interface for all the concrete
  strategies.
- **Concrete Strategies**: These are the implementations of the Strategy interface, where each concrete strategy
  provides a different algorithm to solve the problem.

```python
from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def execute(self, data) -> None:
        pass

class StrategyA(Strategy):
    def execute(self, data) -> None:
        print("Executing Strategy A")

class StrategyB(Strategy):
    def execute(self, data) -> None:
        print("Executing Strategy B")

class Context:
    def __init__(self, strategy: Strategy):
        self._strategy = strategy

    def execute_strategy(self, data) -> None:
        print("Context is getting data and delegates the execution to the strategy.")
        self._strategy.execute(data)


def main():
    context = Context(StrategyA())
    context.execute_strategy("Some data")

    context = Context(StrategyB())
    context.execute_strategy("Some more data")

if __name__ == "__main__":
    main()
```

This will output:
```text
Context is getting some data and delegates the execution to the strategy.
Executing Strategy A
Context is getting some data and delegates the execution to the strategy.
Executing Strategy B

```

### Template method	Pattern
The Template Method pattern defines the skeleton of an algorithm in a base class and lets subclasses override
specific steps of the algorithm without changing its structure. The pattern is useful when multiple algorithms share
similar steps, but have variations in how those steps are executed.

The Template method	 Pattern consists of the following components:
- **Abstract Class**: This is the base class that defines the template method which contains a series of method calls
  that define the algorithm's structure. It also defines abstract methods that subclasses must implement to provide
  their own implementation for specific steps of the algorithm.
- **Concrete Classes**: These are the subclasses that inherit from the abstract class and provide their own
  implementation for the abstract methods defined in the abstract class. They can also override the template method to
  provide their own variations of the algorithm.

```python
from abc import ABC, abstractmethod

class AbstractClass(ABC):

    def template_method(self):
        self.step_one()
        self.step_two()
        self.step_three()

    @abstractmethod
    def step_one(self):
        ...

    @abstractmethod
    def step_two(self):
        ...

    @abstractmethod
    def step_three(self):
        ...

class ConcreteClassA(AbstractClass):

    def step_one(self):
        print("ConcreteClassA: Step 1")

    def step_two(self):
        print("ConcreteClassA: Step 2")

    def step_three(self):
        print("ConcreteClassA: Step 3")

class ConcreteClassB(AbstractClass):

    def step_one(self):
        print("ConcreteClassB: Step 1")

    def step_two(self):
        print("ConcreteClassB: Step 2")

    def step_three(self):
        print("ConcreteClassB: Step 3")

def main():
    ConcreteClassA().template_method()
    ConcreteClassB().template_method()

if __name__ == "__main__":
    main()
```

This will output:
```text
ConcreteClassA: Step 1
ConcreteClassA: Step 2
ConcreteClassA: Step 3
ConcreteClassB: Step 1
ConcreteClassB: Step 2
ConcreteClassB: Step 3
```

### Visitor Pattern
The Visitor pattern is a behavioral design pattern that allows adding new operations to existing object structures
without modifying them. This pattern is particularly useful when dealing with a complex object structure, such as a
composite object. It allows one to separate an algorithm from the object structure on which it operates, providing a
way to add new operations without altering the structures of the objects. It's especially helpful in cases where most
of the functionality in a system is dependent on the concrete classes of objects.

The Visitor Pattern consists of the following components:
- **Visitor**: An interface or abstract class defining the visit() methods for each type of concrete element.
- **Concrete Visitor**: Implements the Visitor interface and defines the operation to be performed on each type of concrete element.
- **Element**: An interface or abstract class with a method accept() that takes a visitor as an argument.
- **Concrete Element**: Implements the Element interface and defines the accept() method such that it calls the visit() method on the visitor object.

```python
class Visitor:
    def visit_element_a(self, element):
        pass

    def visit_element_b(self, element):
        pass


class ConcreteVisitor(Visitor):
    def visit_element_a(self, element):
        print("ConcreteVisitor: Visiting Element A")

    def visit_element_b(self, element):
        print("ConcreteVisitor: Visiting Element B")


class Element:
    def accept(self, visitor):
        pass


class ConcreteElementA(Element):
    def accept(self, visitor):
        visitor.visit_element_a(self)


class ConcreteElementB(Element):
    def accept(self, visitor):
        visitor.visit_element_b(self)


if __name__ == "__main__":
    elements = [ConcreteElementA(), ConcreteElementB()]
    visitor = ConcreteVisitor()

    for element in elements:
        element.accept(visitor)
```

This will output:
```text
ConcreteVisitor: Visiting Element A
ConcreteVisitor: Visiting Element B
```

## See also
- [Design Patters Part 1 - Creational Patters]( {{< relref "2023-04-09-creational-design-patterns.md" >}})
- [Design Patters Part 2 - Structural Patters]( {{< relref "2023-04-10-structural-design-patterns.md" >}})
- [Design Patters Part 3 - Behavioral Patters](#)
