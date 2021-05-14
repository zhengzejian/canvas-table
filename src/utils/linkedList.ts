
type TNodeFunction = (node: Node) => void
type TNodeCompare = (node: Node) => boolean

class Node {
    public data: any;
    public prev: Node | null;
    public next: Node | null;
    constructor(data: any) {
        this.prev = null
        this.next = null
        this.data = data
    }
    after(fn: TNodeFunction) {
        let node = this.next
        while (node) {
            fn(node)
            node = this.next
        }
    }
}

export default class DoublyLinkedList {
    public head: Node | null;
    public tail: Node | null;
    constructor() {
        this.head = null
        this.tail = null
    }
    // 在链表尾部添加一个新节点
    add(item: any) {
        let node = new Node(item)
        if (!this.head) {
            this.head = node
            this.tail = node
        } else {
            node.prev = this.tail
            this.tail!.next = node
            this.tail = node
        }
    }
    // 在链表指定位置添加节点
    addAt(index: number, item: any) {
        let node = new Node(item)
        let counter = 1
        let current = this.head
        if (!index) {
            this.head!.prev = node
            node.next = this.head
            this.head = node
        } else {
            while (current) {
                current = current.next
                if (counter === index) {
                    node.prev = current!.prev
                    node.next = current
                    current!.prev = node
                }
                counter++
            }
        }
    }
    // 删除链表指定数据项节点
    remove(item: any) {
        let current = this.head
        while (current) {
            if (current.data === item) {
                if (this.head === current && this.tail === current) {
                    this.head = null
                    this.tail = null
                } else if (this.head === current) {
                    this.head = current.next
                    this.head!.prev = null
                } else if (this.tail === current) {
                    this.tail = this.tail.prev
                    this.tail!.next = null
                } else {
                    current.prev!.next = current.next
                    current.next!.prev = current.prev
                }
                break
            }
            current = current.next
        }
    }
    // 删除链表指定位置
    removeAt(index: number) {
        let current = this.head
        let counter = 1
        if (index === 0) {
            this.head = this.head!.next
            this.head!.prev = null
        } else {
            while (current) {
                current = current.next
                if (counter === index) {
                    current!.prev!.next = current!.next
                    current!.next!.prev = current!.prev
                    break
                }
                counter++
            }
        }
    }
    // 判断链表是否为空
    isEmpty(): boolean {
        return this.length() < 1
    }
    // 查找链表长度
    length(): number {
        let current = this.head
        let counter = 0
        while (current) {
            counter++
            current = current.next
        }
        return counter
    }
    // 遍历链表
    traverse(fn: TNodeFunction) {
        let current = this.head
        while (current) {
            // 执行回调
            fn(current)
            current = current.next
        }
    }
    findIndex(compare: TNodeCompare) {
        let current = this.head
        let counter = 0
        while (current) {
            if (compare(current)) return counter
            current = current.next
            counter++
        }
        return -1
    }
}