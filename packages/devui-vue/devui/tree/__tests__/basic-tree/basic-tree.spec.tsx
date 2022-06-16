import type { ComponentPublicInstance } from 'vue';
import { ref, onMounted } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { Tree } from '../../';
import { basicTreeData } from './basic-tree-data';

describe('Basic tree', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;

  beforeAll(() => {
    wrapper = mount({
      setup() {
        const treeRef = ref<any>(null);
        onMounted(() => {
          treeRef.value.treeFactory.expandAllNodes();
        });
        return () => {
          return <Tree data={basicTreeData} ref={treeRef} />;
        };
      },
    });
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('Should render tree container correctly.', () => {
    expect(wrapper.find('.devui-tree').exists()).toBe(true);
  });

  it('Should render correct number of child nodes.', () => {
    expect(wrapper.findAll('.devui-tree__node')).toHaveLength(5);
  });

  it('Should render correct node content.', () => {
    const TREE_NODE_DICT = [
      'Parent node 1',
      'Parent node 1-1',
      'Leaf node 1-1-1',
      'Leaf node 1-2',
      'Leaf node 2',
    ];
    const titleList = wrapper.findAll('.devui-tree__node-title');
    TREE_NODE_DICT.forEach((item, index) => {
      expect(titleList[index].text()).toBe(item);
    });
  });

  it('Should render expand-collapse button correctly.', () => {
    const nodes = wrapper.findAll('.devui-tree__node');
    nodes.slice(0, 2).forEach((item) => {
      const curNode = item.find('.devui-tree__node-folder > svg');
      expect(curNode.exists()).toBe(true);
      expect(curNode.classes()).toContain('svg-icon-close');
    });
  });

  it('Should render the style of child node correctly.', () => {
    const nodes = wrapper.findAll('.devui-tree__node');
    expect(nodes[0].attributes('style')).toContain('padding-left: 0px');
    expect(nodes[0].find('.devui-tree__node-folder > .devui-tree__node-indent').exists()).toBe(false);

    expect(nodes[1].attributes('style')).toContain('padding-left: 24px');
    expect(nodes[1].find('.devui-tree__node-folder > .devui-tree__node-indent').exists()).toBe(false);

    expect(nodes[2].attributes('style')).toContain('padding-left: 48px');
    expect(nodes[2].find('.devui-tree__node-folder > .devui-tree__node-indent').exists()).toBe(true);

    expect(nodes[nodes.length - 1].attributes('style')).toContain('padding-left: 0px');
    expect(nodes[nodes.length - 1].find('.devui-tree__node-folder > .devui-tree__node-indent').exists()).toBe(true);
  });

  it('The node should be highlighted when clicked.', async () => {
    const nodes = wrapper.findAll('.devui-tree__node');
    // 可点击且非高亮的的节点，点击之后应该高亮
    expect(nodes[1].find('.devui-tree__node-content').classes()).not.toContain('active');
    await nodes[1].find('.devui-tree__node-content').trigger('click');
    expect(nodes[1].find('.devui-tree__node-content').classes()).toContain('active');

    // 点击非高亮节点，该节点高亮，已高亮节点应该取消高亮
    expect(nodes[2].find('.devui-tree__node-content').classes()).not.toContain('active');
    await nodes[2].find('.devui-tree__node-content').trigger('click');
    expect(nodes[2].find('.devui-tree__node-content').classes()).toContain('active');
    expect(nodes[1].find('.devui-tree__node-content').classes()).not.toContain('active');
  });

  it('The node should be disabled and unclickable when disabled is set to true.', async () => {
    const nodes = wrapper.findAll('.devui-tree__node');
    // 设置了 disabled: true 的节点为禁用态，不可点击
    expect(nodes[0].find('.devui-tree__node-title').classes()).toContain('select-disabled');
    expect(nodes[0].find('.devui-tree__node-content').classes()).not.toContain('active');
    await nodes[0].trigger('click');
    expect(nodes[0].find('.devui-tree__node-content').classes()).not.toContain('active');
  });

  it('The node should expand and collapse correctly when the expand-collapse button is clicked.', async () => {
    const nodes = wrapper.findAll('.devui-tree__node');
    // 初始状态，节点是展开的
    expect(nodes[0].classes()).toContain('devui-tree__node--open');

    // 点击之后，节点收起
    await nodes[0].get('.devui-tree__node-folder').trigger('click');
    expect(nodes[0].classes()).not.toContain('devui-tree__node--open');

    // 再次点击，节点展开
    await nodes[0].get('.devui-tree__node-folder').trigger('click');
    expect(nodes[0].classes()).toContain('devui-tree__node--open');
  });

  it.todo('Should render the style of node connection line correctly.');

  it.todo('The node should be disabled and unclickable when disableToggle is set to true.');
});
