<template>
  <div>
  <Alert v-if="message && variant" :msg="message" :variant="variant"></Alert>
    <b-table 
      striped 
      hover 
      :items="items" 
      :fields=fields
      show-empty
      small
      >
      <template #cell(actions)="row">
        <b-col inline>
          <div @click="editUser(row)">
            <Icon icon="pencil-square" variant="primary"></Icon>
          </div>
          <div @click="deleteUser(row)">
            <Icon variant="danger" icon="trash-fill"></Icon>
          </div>
        </b-col>
      </template>
    </b-table>
      <b-modal ref="edit-modal" id="modal-2" :title="modalTitle">
        <div>
            <b-form>
                <b-form-group id="input-group-2" label="Full Name:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="name"
                    placeholder="Enter name"
                    :class="errors.name ? 'is-invalid' : ''"
                    ></b-form-input>
                    <div :class="errors.name ? 'd-block invalid-feedback' : ''">
                        {{errors.name}}
                    </div>
                </b-form-group>
                <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="input-1"
                    description="We'll never share your email with anyone else."
                >
                    <b-form-input
                    id="input-1"
                    v-model="email"
                    type="email"
                    placeholder="Enter email"
                    :class="errors.email ? 'is-invalid' : ''"
                    ></b-form-input>
                    <div :class="errors.email ? 'd-block invalid-feedback' : ''">
                        {{errors.email}}
                    </div>
                </b-form-group>
                <b-form-group id="input-group-3" label="Address :" label-for="textarea">
                    <b-form-textarea
                        id="textarea"
                        v-model="address"
                        placeholder="Enter something..."
                        rows="3"
                        max-rows="6"
                        :class="errors.address ? 'is-invalid' : ''"
                    >
                    </b-form-textarea>
                    <div :class="errors.address ? 'd-block invalid-feedback' : ''">
                        {{errors.address}}
                    </div>
                </b-form-group>
            </b-form>
        </div>
        <template #modal-footer>
            <div class="w-100">
                <b-button
                    variant="secondary"
                    size="sm"
                    class="float-left"
                    @click="onClose()"
                >
                    Close
                </b-button>
                <b-button
                    variant="primary"
                    size="sm"
                    class="float-right"
                    @click="onSubmit()"
                >
                    Save
                </b-button>
            </div>
        </template>
      </b-modal>
  </div>
</template>

<script>
import Icon from './Icon.vue'
import Alert from './Alert.vue'
import UserService from '../services/UserService';
  export default {
  components: { Icon, Alert },
    name: 'Table',
    props : {
      items : Array,
      fields : Array
    },
    data() {
      return {
        email: '',
        name : '',
        address: '',
        editID : '',
        modalTitle: 'Edit User',
        errors : [],
        message : '',
        variant : ''
      }
    },
    methods: {
      editUser (userData) {
        this.email = userData.item.email
        this.address = userData.item.address
        this.name = userData.item.name
        this.editID = userData.item.id
        this.$refs['edit-modal'].show()
      },
      onSubmit() {
        this.errors= []
        var data = {
            name: this.name,
            email: this.email,
            address: this.address
        }
        UserService.update_user(data, this.editID).then(response => {
            console.log(response);
            if (response.status == 200 && response.data.response) {
                this.$refs['edit-modal'].hide()
                this.message = response.data.message;
                this.variant = "success";
                this.alertClose()
                this.name = ''
                this.email = ''
                this.address = ''
                this.userListing()
            } else {
                var errorname = response.data.errors.name ? response.data.errors.name[0] : ''
                var erroremail = response.data.errors.email ? response.data.errors.email[0] : ''
                var erroraddress = response.data.errors.address ? response.data.errors.address[0] : ''
                this.errors = {
                    name: errorname,
                    email: erroremail,
                    address: erroraddress
                }
            }
        }).catch(error => {
            console.log('Error : ', error);
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose()
            this.name = ''
            this.email = ''
            this.address = ''
        })
      },
      onClose () {
        this.$refs['edit-modal'].hide()
        this.name = ''
        this.email = ''
        this.address = ''
      },
      deleteUser (userData) {
        console.log("user data : ", userData);
      },
      alertClose() {
        setTimeout(() => {
            this.message = "";
            this.variant = "";
        }, 2000);
      }
    },
  }
</script>