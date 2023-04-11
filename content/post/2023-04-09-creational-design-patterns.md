+++
title = "Object oriented design patterns - Creational patterns (Part 1)"
description = "The Gang of Four's classic creational design patterns."
author = "Morten Dæhli Aslesen"
date = 2023-04-09T10:21:00.000Z
tags = ["software design", "object-oriented programming"]
draft = false
+++

This is the first part in a series of 3 blog post summarizing the classic book
["Design Patterns: Elements of Reusable Object-Oriented Software"](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)
by Gamma, Helm, Johnson and Vlissides, collectively known as the Gang of Four (GoF).
The book is widely regarded as a seminal work in the field of software engineering and is
frequently cited as one of the most influential books in the industry.

The book focuses on the concept of software design patterns, which are reusable solutions to common programming
problems. The authors identify 23 design patterns, which are divided into three categories: creational, structural,
and behavioral patterns.

I'm, admittingly, not a huge fan of OOP design patterns, since they ofter create unnecessary complexity. Nonetheless,
I think they are a good source to understand object-oriented heavy code bases, it's good to understand the terminology,
and they are really powerful when used correctly.

## Overview

In this blog post we will look into the creational patterns only, but here is a complete overview of the patterns
you will find in the book:

| Purpose    | Design pattern          | Varying aspect they help solve           |
|------------|-------------------------|------------------------------------------|
| Creational | Abstract factory        | Families of objects                      |
|            | Builder                 | Composite object creation                |
|            | Factory method          | Subclass of objects                      |
|            | Prototype               | Class of object                          |
|            | Singleton               | Sole instance of a object                |
| Structural | Adapter                 | Interface between objects                |
|            | Bridge                  | Implementation of objects                |
|            | Composite               | Composition and structure                |
|            | Decorator               | Responsibility                           |
|            | Facade                  | Interface to a system                    |
|            | Flyweight               | Storage cost                             |
|            | Proxy                   | Location of object                       |
| Behavioral | Chain of responsibility | Object that can fulfill a responsibility |
|            | Command                 | How a request is handled                 |
|            | Interpreter             | Interpretation or grammar                |
|            | Iterator                | How an object is traversed               |
|            | Mediator                | Object interactions                      |
|            | Memento                 | Sharing of private information           |
|            | Observer                | Object depending on other objects        |
|            | State                   | State of and object                      |
|            | Strategy                | Algorithms                               |
|            | Template method         | Algorithm steps                          |
|            | Visitor                 | Operations that can be applied           |

## Creational Patterns
Creational patterns are a type of design pattern that deal with object creation mechanisms.
Creational patterns provide various ways to create objects while hiding the creation logic,
making the code more flexible and reusable.

We will now look into the Abstract factory, Builder, Factory method, Prototype and the Singleton patterns
with examples using Python.

### Abstract Factory Pattern
Abstract Factory provides an interface for creating families of related or dependent
objects without specifying their concrete classes. This pattern is useful when we need to create multiple objects that
work together in a specific way, but the actual implementation of each object is not known before run-time. E.g. the
factory used depends on environmental variables or input from the user.

The Abstract Factory pattern consists of four main components:

- **Abstract Factory**: an interface that defines methods for creating the related products.
- **Concrete Factory**: a class that implements the Abstract Factory interface to create concrete products.
- **Abstract Product**: an interface that defines the methods that concrete products must implement.
- **Concrete Product**: a class that implements the Abstract Product interface.

```python
from __future__ import annotations
from abc import ABC, abstractmethod

class AbstractFactory(ABC):
    @abstractmethod
    def create_product_a(self) -> AbstractProductA:
        pass

    @abstractmethod
    def create_product_b(self) -> AbstractProductB:
        pass

class ConcreteFactory1(AbstractFactory):
    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA1()

    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB1()

class ConcreteFactory2(AbstractFactory):
    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA2()

    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB2()


class AbstractProductA(ABC):
    @abstractmethod
    def do_something(self):
        ...

class AbstractProductB(ABC):
    @abstractmethod
    def do_something_else(self):
        ...

class ConcreteProductA1(AbstractProductA):
    def do_something(self):
        print("ConcreteProductA1 does something")

class ConcreteProductA2(AbstractProductA):
    def do_something(self):
        print("ConcreteProductA2 does something")

class ConcreteProductB1(AbstractProductB):
    def do_something_else(self):
        print("ConcreteProductB1 does something else")

class ConcreteProductB2(AbstractProductB):
    def do_something_else(self):
        print("ConcreteProductB2 does something else")

def client(factory: AbstractFactory):
    print(f"Client Using factory: {factory.__class__.__name__}")
    product_a = factory.create_product_a()
    product_b = factory.create_product_b()
    product_a.do_something()
    product_b.do_something_else()

def main():
    client(ConcreteFactory1())
    client(ConcreteFactory2())
    
if __name__ == "__main__":
    main()
```

This will output
```text
Client Using factory: ConcreteFactory1
ConcreteProductA1 does something
ConcreteProductB1 does something else
Client Using factory: ConcreteFactory2
ConcreteProductA2 does something
ConcreteProductB2 does something else
```
### Builder Pattern

The Builder Pattern separates the construction of a complex object from its representation, allowing the same
construction process to create different representations. It allows you to construct complex objects step by step,
and gives you control over the individual steps of the construction process. An example of this would be for example
parsing Rich Text Format (RFT) to different text formats such as ASCII, LaTeX, text widget, etc. 

The Builder Pattern consists of several components:

- **Builder**: an abstract interface that defines the steps for constructing a complex object.
- **Concrete Builder**: a concrete class that implements the Builder interface to build a specific type of complex object.
- **Product**: the complex object being built.
- **Director**: a class that constructs an object using the Builder interface.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

class Builder(ABC):
    @abstractmethod
    def add_part_a(self):
        pass

    @abstractmethod
    def add_part_b(self):
        pass

    @abstractmethod
    def get_product(self) -> Product:
        pass

class ConcreteBuilder1(Builder):
    def __init__(self):
        self.product: Product = Product()

    def add_part_a(self):
        self.product.add_part("Part A1")

    def add_part_b(self):
        self.product.add_part("Part B1")

    def get_product(self) -> Product:
        return self.product

class ConcreteBuilder2(Builder):
    def __init__(self):
        self.product: Product = Product()

    def add_part_a(self):
        self.product.add_part("Part A2")

    def add_part_b(self):
        self.product.add_part("Part B2")

    def get_product(self) -> Product:
        return self.product

class Product:
    def __init__(self):
        self.parts: List[str] = []

    def add_part(self, part: str):
        self.parts.append(part)

    def list_parts(self) -> str:
        return f"Product parts: {', '.join(self.parts)}"

class Director:
    def __init__(self, builder: Builder):
        self.builder: Builder = builder

    def build_part_a(self):
        self.builder.add_part_a()

    def build_part_b(self):
        self.builder.add_part_b()

def client(builder: Builder, director: Director) -> None:

    print(f"Using builder: {director.builder.__class__.__name__}")
    director.build_part_a()
    director.build_part_b()
    print(builder.get_product().list_parts())

def main():
    builder1 = ConcreteBuilder1()
    director1 = Director(builder1)
    client(builder=builder1, director=director1)

    builder2 = ConcreteBuilder2()
    director2 = Director(builder2)
    client(builder=builder2, director=director2)

if __name__ == "__main__":
    main()
```

This will output
```text
Using builder: ConcreteBuilder1
Product parts: Part A1, Part B1
Using builder: ConcreteBuilder2
Product parts: Part A2, Part B2
```

### Factory Method Pattern
The Factory Method Pattern provides an interface for creating objects, but allows subclasses to decide which class to
instantiate. It is useful when you want to encapsulate object creation in a separate class or when you don't know what
objects need to be created until runtime.

The Factory Method Pattern consists of several components:

- **Product**: an abstract interface that defines the methods of the objects that the factory method creates.
- **Concrete Products**: concrete classes that implement the Product interface.
- **Creator**: an abstract interface that declares the factory method that returns an object of type Product.
- **Concrete Creators**: concrete classes that implement the Creator interface and define the factory method that returns an instance of the Concrete Product.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import TypeVar, Generic

T = TypeVar('T')

class Product(Generic[T], ABC):
    @abstractmethod
    def operation(self) -> T:
        pass

class ConcreteProduct1(Product[int]):
    def operation(self) -> int:
        return 1

class ConcreteProduct2(Product[str]):
    def operation(self) -> str:
        return "2"

class Creator(Generic[T], ABC):
    @abstractmethod
    def factory_method(self) -> Product[T]:
        ...

    def an_operation(self) -> str:
        product = self.factory_method()
        return product.operation()

class ConcreteCreator1(Creator[int]):
    def factory_method(self) -> ConcreteProduct1:
        return ConcreteProduct1()

class ConcreteCreator2(Creator[str]):
    def factory_method(self) -> ConcreteProduct2:
        return ConcreteProduct2()

def client_code(creator: Creator[T]) -> None:
    print(f"Using Creator: {creator.__class__.__name__}")
    result = creator.an_operation()
    print(f"Result of method creator.an_operation() is type: {type(result).__name__} and value: {result}")


def main():
    creator1 = ConcreteCreator1()
    creator2 = ConcreteCreator2()

    client_code(creator1)
    client_code(creator2)

if __name__ == "__main__":
    main()
```

This will output
```text
Using Creator: ConcreteCreator1
Result of method creator.an_operation() is type: int and value: 1
Using Creator: ConcreteCreator2
Result of method creator.an_operation() is type: str and value: 2
```

### Prototype Pattern
The Prototype Pattern is used to create new objects by cloning existing ones. Instead of creating a new object from
scratch, the prototype pattern allows the creation of new objects by copying an existing instance's properties.

The Prototype Pattern consists of several components:

- **Prototype**: This is an abstract class or interface that defines the clone method.
  The clone method is responsible for creating and returning a copy of the object.
- **Concrete Prototype**: This is a concrete implementation of the Prototype class. It overrides the clone method to
  create and return a copy of itself.
- **Client**: This is the class or object that creates new objects by cloning existing ones. The client can use the
  clone method to create new objects without having to know the details of how the objects are created.

```python
from __future__ import annotations

from abc import abstractmethod, ABC
from copy import deepcopy
from typing import Any, Optional


class Prototype(ABC):

    @abstractmethod
    def clone(self) -> Any:
        pass

class ConcretePrototype(Prototype):
    def __init__(self, a: int, b: str) -> None:
        super().__init__()
        self.a = a
        self.b = b

    def clone(self) -> ConcretePrototype:
        return deepcopy(self)

def client_code():
    my_object = ConcretePrototype(a=42, b="My prototype string")
    my_clone = my_object.clone()
    my_clone.a = 24
    my_clone.b = "My custom string"

    print(f"Original: a={my_object.a}, b={my_object.b}, id={id(my_object)}")
    print(f"Clone: a={my_clone.a}, b={my_clone.b}, id={id(my_clone)}")

if __name__ == "__main__":
    client_code()
```

This will output
```text
Original: a=42, b=My prototype string, id=4437581968
Clone: a=24, b=My custom string, id=4437581008
```

### Singleton Pattern
The Singleton Pattern ensures a class has only one instance and provides a global point of access to it.
It is useful when there is a need to restrict the number of instances of a class, such as when a shared resource needs
to be accessed by multiple objects.

The Singleton Pattern consists of only one component:

- **Singleton**: a class that can have only one instance, provides a global point of access to it, and ensures that
  the instance is created only once.


```python
from __future__ import annotations

class Singleton:
    _instance = None

    def __new__(cls) -> Singleton:
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def some_operation(self, message: str) -> str:
        return f"My object ID is {id(self)} My message is: {message}"

def main() -> None:
    s1 = Singleton()
    s2 = Singleton()

    print(f"s1.some_operation returns: {s1.some_operation('s1')}")
    print(f"s2.some_operation returns: {s1.some_operation('s1')}")

    if s1 is s2:
        print("I'm a single instance, also known as a Singleton")
    else:
        print("Ohh my... this shouldn't be possible!")

if __name__ == "__main__":
    main()
```

This will output something like this:
```text
s1.some_operation returns: My object ID is 4515700304 My message is: s1
s2.some_operation returns: My object ID is 4515700304 My message is: s1
I'm a single instance, also known as a Singleton
```

That's it! I hope you learned something 🧑‍🏫⭐

Stay tuned for the next part on structural patterns 👋

## See also
- [Design Patters Part 1 - Creational Patters](#)
- [Design Patters Part 2 - Structural Patters]( {{< relref "2023-04-10-structural-design-patterns.md" >}})
- [Design Patters Part 3 - Behavioral Patters]( {{< relref "2023-04-11-behavioral-design-patterns.md" >}})
