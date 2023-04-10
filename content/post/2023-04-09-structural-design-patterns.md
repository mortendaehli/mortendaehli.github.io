+++
title = "Object oriented design patterns - Structural patterns (Part 2)"
description = "The Gang of Four's classic structural design patterns."
author = "Morten Dæhli Aslesen"
date = 2023-04-10T12:59:00.000Z
tags = ["software design", "object-oriented programming"]
draft = false
+++

This is the second part in a series of 3 blog post summarizing the famous 
by Gamma, Helm, Johnson and Vlissides, also known as the Gang of Four.

See the first post for an overview:
- [Creational Patters - Part 1](2023-04-09-creational-design-patterns.md)


## Structural Patterns
Structural patterns are design patterns that deal with object composition to form larger structures, such as class
and object relationships, to simplify the design and implementation of complex systems. They focus on how objects are
composed to form larger structures and provide solutions for designing systems that are flexible and easy to maintain.

### Adapter Pattern
The Adapter Pattern allows the interface of an existing class to be used as another interface. It is useful when two
incompatible interfaces need to work together.

The Adapter Pattern consists of the following components:

- **Target**: the interface that the client code uses.
- **Adaptee**: the interface that needs to be adapted.
- **Adapter**: the class that adapts the Adaptee interface to the Target interface.
```python
from abc import ABC, abstractmethod


class Target(ABC):
    @property
    @abstractmethod
    def width(self) -> float:
        ...

    @property
    @abstractmethod
    def height(self) -> float:
        ...

class Adaptee:
    def __init__(self, side_length: float) -> None:
        self.side_length = side_length

    def area(self) -> float:
        return self.side_length ** 2

class Adapter(Target):
    def __init__(self, square: Adaptee) -> None:
        self.square = square

    @property
    def width(self) -> float:
        return self.square.side_length

    @property
    def height(self) -> float:
        return self.square.side_length


def client_code() -> None:
    print("Adapting a Square to a Rectangle using an Adapter")
    square = Adaptee(3.14)
    adapter = Adapter(square)

    print(f"Area of square: {square.area()}")
    print(f"Width of adapter: {adapter.width}")
    print(f"Height of adapter: {adapter.height}")


if __name__ == "__main__":
    client_code()
```

This will output:
```text
Adapting a Square to a Rectangle using an Adapter
Area of square: 9.8596
Width of adapter: 3.14
Height of adapter: 3.14
```

### Bridge Pattern
The Bridge Pattern decouples an abstraction from its implementation, allowing the two to vary independently.
It involves creating two separate hierarchies, one for the abstraction and one for the implementation,
and using composition to tie them together.

The Bridge Pattern consists of the following components:
- **Abstraction**: This is an abstract class that defines the interface or the abstraction layer. It has a reference
  to an implementation object and delegates the implementation-specific operations to that object.
- **Refined Abstraction**: This is a subclass of the Abstraction class that provides additional methods and
  functionality that are not available in the base Abstraction class.
- **Implementation**: This is an interface that defines the implementation methods. The implementation classes implement
  this interface to provide the actual implementation of the abstraction methods.
- **Concrete Implementation**: This is a concrete class that implements the Implementation interface. It provides the
  actual implementation of the abstraction methods.

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class Abstraction:
    def __init__(self, implementation: Implementation) -> None:
        self.implementation = implementation

    def operation(self) -> str:
        return f"Abstraction: {self.implementation.operation_implementation()}"

class RefinedAbstraction(Abstraction):
    def operation(self) -> str:
        return f"ExtendedAbstraction: {self.implementation.operation_implementation()}"

class Implementation(ABC):
    @abstractmethod
    def operation_implementation(self) -> str:
        pass

class ConcreteImplementationA(Implementation):
    def operation_implementation(self) -> str:
        return "Concrete Implementation A"

class ConcreteImplementationB(Implementation):
    def operation_implementation(self) -> str:
        return "Concrete Implementation B"

def client_code() -> None:
    implementation = ConcreteImplementationA()
    abstraction = Abstraction(implementation)
    print(abstraction.operation())

    implementation = ConcreteImplementationB()
    abstraction = RefinedAbstraction(implementation)
    print(abstraction.operation())


if __name__ == "__main__":
    client_code()
```

This will output:
```text
Abstraction: Concrete Implementation A
ExtendedAbstraction: Concrete Implementation B
```

### Composite Pattern
The Composite pattern allows you to treat groups of objects in the same way as you would treat a single instance
of an object. The pattern creates a tree-like structure where objects can be grouped together in a parent-child
relationship, forming a composite object.

The main idea behind the Composite pattern is to create a unified interface for individual objects and groups of
objects. In other words, you can treat a single object and a group of objects as if they were the same thing, by
defining a common interface that they all implement.

The Composite Pattern consists of the following components:
- **Component**: This is the abstract base class that defines the common interface for both leaf and composite objects.
  The Component class usually has a set of operations that all components should implement, regardless of
  whether they are leaf or composite objects.
- **Leaf**: This represents the individual objects that form the "leaf" nodes in the composite structure.
  Leaf objects cannot have children.
- **Composite**: This represents the composite objects that have children. Composite objects have a list of child
  components, and they forward operations to all their child components.

It's a good idea to use a pre-build graph framework with a DAG instead of "reinventing the wheel".
But as always, you should have a good idea about the underlying implementation.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List, Iterator


class Component(ABC):
    def __init__(self, name: str):
        self.name = name
        self._children: List[Component] = []

    @property
    def children(self) -> Iterator[Component]:
        for child in self._children:
            yield child

    @abstractmethod
    def add(self, component: Component):
        ...

    @abstractmethod
    def remove(self, component: Component):
        ...

    @abstractmethod
    def operation(self) -> str:
        ...

    @property
    @abstractmethod
    def _is_composite(self) -> bool:
        ...

class Leaf(Component):

    def add(self, component: Component):
        pass

    def remove(self, component: Component):
        pass

    def operation(self) -> str:
        return self.name

    @property
    def _is_composite(self) -> bool:
        return False

class Composite(Component):
    def __init__(self, name: str):
        super().__init__(name=name)
        self._children = []

    def add(self, component):
        self._children.append(component)

    def remove(self, component):
        self._children.remove(component)

    def operation(self) -> str:
        return f"Branch({'+'.join([child.operation() for child in self.children])})"

    @property
    def _is_composite(self) -> bool:
        return True

def client_code():
    # Single leaf
    leaf = Leaf("Single Leaf")
    print(f"Leaf operation: {leaf.operation()}")

    # Composite tree
    tree = Composite("Tree")
    branch1 = Composite("Branch 1")
    branch2 = Composite("Branch 2")
    leaf1 = Leaf("Leaf 1")
    leaf2 = Leaf("Leaf 2")
    leaf3 = Leaf("Leaf 3")
    branch2.add(leaf1)
    branch2.add(leaf2)
    tree.add(branch1)
    tree.add(branch2)
    tree.add(leaf3)
    print(f"Composite operation: {tree.operation()}")


if __name__ == "__main__":
    client_code()
```

This will output:
```text
Leaf operation: Single Leaf
Composite operation: Branch(Branch()+Branch(Leaf 1+Leaf 2)+Leaf 3)
```

### Decorator Pattern
With the Decorator pattern, you can add new behavior to an object by wrapping it with one or more decorators.
Each decorator adds new behavior to the object, and the object can have multiple decorators.
The object's behavior can be modified dynamically at runtime by adding or removing decorators.

When you call an operation on a decorated object, the operation is forwarded to the base object, which may then be
forwarded to one or more decorators before finally being executed. Each decorator may modify the behavior of the
operation before forwarding it to the next decorator or to the base object.

The Decorator pattern is often used when you want to add behavior to an object, but you don't want to modify the
object's class or create a new subclass. Instead, you can wrap the object with one or more decorators that add new
behavior. This approach allows you to modify the behavior of an object at runtime, without affecting other objects
of the same class.

The Decorator Pattern consists of the following components:
- **Component**: This is the abstract base class that defines the interface for objects that can be decorated.
  The Component class usually has a set of operations that all components should implement.
- **ConcreteComponent**: This represents the base object that can be decorated. It implements the Component interface
  and provides the default behavior.
- **Decorator**: This is the abstract base class for all decorators. The Decorator class can hve a reference to a
  Component object, which it wraps and decorates. The Decorator class also implements the Component interface and
  forwards requests to the wrapped component.
- **ConcreteDecorator**: This represents the actual decorator that adds new behavior to the base object.
  The ConcreteDecorator class extends the Decorator class and adds new behavior to the wrapped component.

```python
from abc import ABC, abstractmethod


class Component(ABC):
    @abstractmethod
    def operation(self) -> None:
        ...


class ConcreteComponent(Component):
    def operation(self) -> None:
        print("ConcreteComponent.operation")


class Decorator(ABC):

    def __init__(self, component: Component):
        self.component = component

    @abstractmethod
    def operation(self) -> None:
        ...

    def __call__(self, ):
        self.operation()
        self.component.operation()



class ConcreteDecoratorA(Decorator):
    def operation(self) -> None:
        print("I got decorated by ConcreteDecoratorA")


class ConcreteDecoratorB(Decorator):
    def operation(self) -> None:
        print("I got decorated by ConcreteDecoratorB")


def client_code():
    simple = ConcreteComponent()
    print("Simple ConcreteComponent.operation")
    simple.operation()

    print("Decorated: ConcreteComponent.operation")
    simple_decorated_a = ConcreteDecoratorA(simple)
    simple_decorated_b = ConcreteDecoratorB(simple)
    simple_decorated_a()
    simple_decorated_b()

if __name__ == "__main__":
    client_code()
```

This will output:
```text
Simple ConcreteComponent.operation
ConcreteComponent.operation
Decorated: ConcreteComponent.operation
I got decorated by ConcreteDecoratorA
ConcreteComponent.operation
I got decorated by ConcreteDecoratorB
ConcreteComponent.operation
```

### Facade Pattern
The Facade pattern provides a simple and unified interface to a complex system.It encapsulates the complexity of the
system and presents a simplified interface to the client. This pattern is used to provide a higher-level interface that
makes it easier for clients to use the system.

The Facade Pattern consists of the following components:
- **Facade**: This is the central class that provides a simple and unified interface to a complex subsystem.
  The Facade class provides methods that encapsulate the interactions between the client and the subsystem.
- **Subsystem**: This is the collection of classes that implement the functionality of the system. The Subsystem
  classes are not visible to the client and are accessed only through the Facade class.
- **Client**: This is the class that uses the Facade class to interact with the system. The client does not need to
  know the details of the subsystem, as it interacts only with the Facade class.


```python
from __future__ import annotations


class Facade:

    def __init__(self):
        self.subsystem_a = SubsystemA()
        self.subsystem_b = SubsystemB()
        self.subsystem_c = SubsystemC()

    def operation(self) -> str:
        results = list()
        results.append("Facade initializes subsystems:")
        results.append(self.subsystem_a.operation_a())
        results.append(self.subsystem_b.operation_b())
        results.append(self.subsystem_c.operation_c())
        results.append("Facade orders subsystems to perform the action:")
        results.append(self.subsystem_a.action_a())
        results.append(self.subsystem_b.action_b())
        results.append(self.subsystem_c.action_c())
        return "\n".join(results)


class SubsystemA:
    @staticmethod
    def operation_a() -> str:
        return "Subsystem A: Ready!"

    @staticmethod
    def action_a() -> str:
        return "Subsystem A: Action!"

class SubsystemB:
    @staticmethod
    def operation_b() -> str:
        return "Subsystem B: Ready!"

    @staticmethod
    def action_b() -> str:
        return "Subsystem B: Action!"

class SubsystemC:
    @staticmethod
    def operation_c() -> str:
        return "Subsystem C: Ready!"

    @staticmethod
    def action_c() -> str:
        return "Subsystem C: Action!"


def client_code():
    facade = Facade()
    result = facade.operation()
    print(result)

if __name__ == "__main__":
    client_code()
```

This will output:
```text
Facade initializes subsystems:
Subsystem A: Ready!
Subsystem B: Ready!
Subsystem C: Ready!
Facade orders subsystems to perform the action:
Subsystem A: Action!
Subsystem B: Action!
Subsystem C: Action!
```

### Flyweight Pattern
The Flyweight pattern is used to minimize memory usage by sharing data across multiple objects. The main idea behind
the Flyweight pattern is to store commonly used data externally and reuse it among multiple objects to avoid
unnecessary duplication. If the application doesn't struggle with shortage of RAM, then this pattern may not be a good
idea.

The Flyweight Pattern consists of the following components:
- **Flyweight**: This is an interface or abstract class that defines the methods that the concrete flyweights must
  implement. It specifies the intrinsic state that is shared among multiple objects.
- **Concrete Flyweight**: This is a concrete implementation of the Flyweight interface. It stores the intrinsic state that
  is shared among multiple objects.
- **Flyweight Factory**: This is a factory that creates and manages the flyweights. It ensures that flyweights are shared
  and reused properly. It maintains a pool of existing flyweights and returns an existing flyweight if one is available,
  or creates a new one if necessary.
- **Client**: This is the object that uses the flyweights. It maintains a reference to the flyweights and passes the
  extrinsic state to the flyweights when necessary.

```python
from abc import ABC, abstractmethod
from typing import Dict, List


class Flyweight(ABC):
    def __init__(self, shared_state: List[str]) -> None:
        self._shared_state = shared_state

    @abstractmethod
    def operation(self, unique_state: List[str]) -> None:
        ...

class ConcreteFlyweight(Flyweight):
    def operation(self, unique_state: List[str]):
        print(f"ConcreteFlyweight: ({self._shared_state}), ({unique_state})")

class FlyweightFactory:
    _flyweights: Dict[str, Flyweight] = {}

    def __init__(self, initial_flyweights: List[List[str]]):
        for state in initial_flyweights:
            self._flyweights[self.get_key(state)] = ConcreteFlyweight(state)

    @staticmethod
    def get_key(state):
        return "_".join(sorted(state))

    def get_flyweight(self, shared_state: List[str]) -> Flyweight:
        key = self.get_key(shared_state)
        if key not in self._flyweights:
            print("FlyweightFactory: Does not exist, creating a new Flyweight.")
            self._flyweights[key] = ConcreteFlyweight(shared_state)
        else:
            print("FlyweightFactory: Using existing Flyweight.")
        return self._flyweights[key]

    def list_flyweights(self):
        print(f"FlyweightFactory: I have {len(self._flyweights)} flyweights:")
        print(", ".join(list(self._flyweights.keys())))

def client_code(factory: FlyweightFactory, shared_state: List[str], unique_state: List[str]):
    flyweight = factory.get_flyweight(shared_state)
    flyweight.operation(unique_state)

if __name__ == "__main__":
    factory = FlyweightFactory([
        ["Apple", "Red", "Round"],
        ["Banana", "Yellow", "Curved"],
        ["Grape", "Purple", "Round"],
        ["Watermelon", "Green", "Oval"]
    ])
    factory.list_flyweights()

    client_code(factory, ["Apple", "Red", "Round"], ["My", "Unique", "state", "1"])
    client_code(factory, ["Banana", "Yellow", "Curved"], ["My", "Unique", "state", "2"])
    client_code(factory, ["Grape", "Purple", "Round"], ["My", "Unique", "state", "3"])
    client_code(factory, ["Watermelon", "Green", "Oval"], ["My", "Unique", "state", "4"])
    client_code(factory, ["Apple", "Red", "Round"], ["My", "Unique", "state", "5"])
    client_code(factory, ["Pear", "Yellow", "Round"], ["My", "Unique", "state", "6"])
```

This will output:
```text
FlyweightFactory: I have 4 flyweights:
Apple_Red_Round, Banana_Curved_Yellow, Grape_Purple_Round, Green_Oval_Watermelon
FlyweightFactory: Using existing Flyweight.
ConcreteFlyweight: (['Apple', 'Red', 'Round']), (['My', 'Unique', 'state', '1'])
FlyweightFactory: Using existing Flyweight.
ConcreteFlyweight: (['Banana', 'Yellow', 'Curved']), (['My', 'Unique', 'state', '2'])
FlyweightFactory: Using existing Flyweight.
ConcreteFlyweight: (['Grape', 'Purple', 'Round']), (['My', 'Unique', 'state', '3'])
FlyweightFactory: Using existing Flyweight.
ConcreteFlyweight: (['Watermelon', 'Green', 'Oval']), (['My', 'Unique', 'state', '4'])
FlyweightFactory: Using existing Flyweight.
ConcreteFlyweight: (['Apple', 'Red', 'Round']), (['My', 'Unique', 'state', '5'])
FlyweightFactory: Does not exist, creating a new Flyweight.
ConcreteFlyweight: (['Pear', 'Yellow', 'Round']), (['My', 'Unique', 'state', '6'])
```

### Proxy Pattern

The Proxy Pattern consists of the following components:

```python

```

This will output:
```text

```