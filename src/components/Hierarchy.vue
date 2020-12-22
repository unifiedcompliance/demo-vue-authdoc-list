<template>
  <div class="hierarchy-list">
    <div class="hierarchy-tree">
      <p class="tree-label">{{ treeLabel }}</p>
      <v-treeview
          v-model="tree"
          :items="treeItems"
          :search="filterKey"
          :filter="filterTree"
          :open="expandedItems"
          open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.icon">
            {{ open && item.openIcon ? item.openIcon : item.icon }}
          </v-icon>
        </template>

        <template v-slot:label="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.name }}</span>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </template>

        <template v-slot:append="{ item }">
          <div class="align-center d-flex">
            <v-icon v-if="item.info" medium @click.stop="infoItem(item.id)">
              mdi-information-outline
            </v-icon>
            <v-checkbox
                v-if="item.selectable"
                v-model="item.selected"
                @click.stop="selectItem(item)"
            ></v-checkbox>
          </div>
        </template>
      </v-treeview>
    </div>

    <div v-if="viewType === 'double'" class="hierarchy-tree">
      <p class="tree-label">{{ selectedTreeLabel }}</p>
      <v-treeview
          v-model="selectedTree"
          :items="selectedTreeItems"
          :open="expandedSelectedItems"
          open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.icon">
            {{ open && item.openIcon ? item.openIcon : item.icon }}
          </v-icon>
        </template>

        <template v-slot:label="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.name }}</span>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </template>

        <template v-slot:append="{ item }">
          <div class="align-center d-flex">
            <v-icon v-if="item.info" medium @click.stop="infoItem(item.id)">
              mdi-information-outline
            </v-icon>
            <v-checkbox
                v-if="item.selectable"
                v-model="item.selected"
                @click.stop="selectItem(item)"
            ></v-checkbox>
          </div>
        </template>
      </v-treeview>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'Hierarchy',
  data: () => {
    return {
      selectedItems: []
    };
  },
  props: {
    viewType: {
      validator: (val) => {
        return ['single', 'double'].indexOf(val) !== -1;
      }
    },
    filterKey: {
      type: String,
      default: ''
    },
    tree: {
      type: Array,
      default: () => []
    },
    selectedTree: {
      type: Array,
      default: () => []
    },
    treeLabel: {
      type: String,
      default: ''
    },
    selectedTreeLabel: {
      type: String,
      default: ''
    },
    treeItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filterTree() {
      return (item, search) => {
        return item.name.indexOf(search) > -1;
      };
    },
    expandedItems() {
      const treeItems = _.cloneDeep(this.treeItems);
      if (this.filterKey === null || this.filterKey === '') {
        return this.filterTreeItemProps(this.filterTreeItems(treeItems, 'id', this.selectedItems), 'id');
      } else {
        return this.filterTreeItemProps(this.filterTreeItems(treeItems, 'name', this.filterKey), 'id');
      }
    },
    selectedTreeItems() {
      const treeItems = _.cloneDeep(this.treeItems);
      return this.filterTreeItems(treeItems, 'id', this.selectedItems);
    },
    expandedSelectedItems() {
      const treeItems = _.cloneDeep(this.selectedTreeItems);
      return this.filterTreeItemProps(this.filterTreeItems(treeItems, 'id', this.selectedItems), 'id');
    }
  },
  watch: {
    treeItems() {
      this.restoreSelectedTreeItems(this.treeItems);
    }
  },
  methods: {
    infoItem(id) {
      this.$emit('item-info', id);
    },
    selectItem(item) {
      const idx = this.selectedItems.indexOf(item.id);
      if (idx > -1) {
        this.selectedItems.splice(idx, 1);
      } else {
        this.selectedItems.push(item.id);
      }
      this.restoreSelectedTreeItems(this.treeItems);

      this.$emit('item-selected', item);
    },
    filterTreeItems(list, prop, filter) {
      const obj = this;
      return _.filter(list, (item) => {
        let filtered = false;
        if (item.children) {
          item.children = obj.filterTreeItems(item.children, prop, filter);
          filtered = !_.isEmpty(item.children);
        }
        if (item[prop]) {
          if (_.isBoolean(filter) && item[prop] === filter) {
            filtered = true;
          } else if (_.isArrayLike(filter) && filter.includes(item[prop])) {
            filtered = true;
          } else if (_.isString(filter) && _.includes(_.toLower(item[prop]), _.toLower(filter))) {
            filtered = true;
          }
        }

        return filtered;
      });
    },
    filterTreeItemProps(list, prop) {
      const obj = this;
      return _.reduce(list, function(result, value, key) {
        if (key === prop) {
          result.push(value);
        } else if (_.isObjectLike(value)) {
          return result.concat(obj.filterTreeItemProps(value, prop));
        }

        return result;
      }, []);
    },
    restoreSelectedTreeItems(list) {
      const obj = this;
      for (const item of list) {
        if (item.children) {
          obj.restoreSelectedTreeItems(item.children);
        }
        item.selected = obj.selectedItems.includes(item.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hierarchy-list {
  width: 100%;
  border: 1px solid #999999;
  display: flex;
}
.hierarchy-tree {
  width: 50%;
  border-right: 1px solid #999999;
  overflow-x: auto;

  &:last-child {
    border-right: none;
  }
}
.tree-label {
  margin: 0;
  padding: 5px;
  border-bottom: 1px solid #999999;
}
.v-input--selection-controls {
  margin: 0;
  padding: 0;
}
</style>

<style>
.v-treeview-node__root {
  min-height: 35px;
}
.v-input__slot {
  margin-bottom: 0 !important;
}
.v-messages {
  display: none;
}
</style>
