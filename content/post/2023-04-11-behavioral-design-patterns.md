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

The Iterator Pattern consists of the following components:

```python

```

This will output:
```text

```

### Mediator Pattern

The Mediator Pattern consists of the following components:

```python

```

This will output:
```text

```

### Memento Pattern

The Memento Pattern consists of the following components:

```python

```

This will output:
```text

```

### Observer Pattern

The Observer Pattern consists of the following components:

```python

```

This will output:
```text

```

### State Pattern

The State Pattern consists of the following components:

```python

```

This will output:
```text

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

The Visitor Pattern consists of the following components:

```python

```

This will output:
```text

```

## See also
- [Design Patters Part 1 - Creational Patters]( {{< relref "2023-04-09-creational-design-patterns.md" >}})
- [Design Patters Part 2 - Structural Patters]( {{< relref "2023-04-10-structural-design-patterns.md" >}})
- [Design Patters Part 3 - Behavioral Patters](#)
