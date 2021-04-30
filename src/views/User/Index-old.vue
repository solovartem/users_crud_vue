<template>
    <div>
        <Navbar />
        <b-container>
            <Alert v-if="message && variant" :msg="message" :variant="variant" />
            <b-card
                header-tag="header"
                class="mt-5"
            >
                <template #header>
                    <h2>
                    Users
                    </h2>
                    <b-button @click="showModal()" variant="primary">
                        <Icon icon="person-plus-fill" variant="white"></Icon> Add User
                    </b-button>
                </template>
                <b-table 
                    striped 
                    bordered
                    hover 
                    class="mb-0"
                    :items="users" 
                    :fields=fields
                    show-empty
                >
                    <template #cell(actions)="row">
                        <b-col inline>
                        <button class="btn btn-primary text-white mr-2" @click="editUser(row)">
                            <Icon icon="pencil-square" variant="white"></Icon>
                        </button>
                         <button class="btn btn-success text-white mr-2" @click="showUserdata(row)">
                            <Icon icon="eye-fill" variant="white"></Icon>
                        </button>
                        <button class="btn btn-danger" @click="deleteUser(row)">
                            <Icon variant="white" icon="trash-fill"></Icon>
                        </button>
                        </b-col>
                    </template>
                </b-table>
            </b-card>
        </b-container>
        <b-modal ref="my-modal" id="modal-1" :title="modalTitle">
            <div>
                <b-form>
                    <b-form-group id="input-group-2" label="Full Name :" label-for="input-2">
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
                        label="Email address :"
                        label-for="input-1"
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
                            placeholder="Enter Address"
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
                        class="float-left"
                        @click="onClose()"
                    >
                        Close
                    </b-button>
                    <b-button
                        variant="primary"
                        class="float-right"
                        @click="onSubmit()"
                    >
                        Save
                    </b-button>
                </div>
            </template>
        </b-modal>
        <b-modal ref="view-modal" id="modal-view" title="View Detail">
            <p> <b>Full Name</b> : {{name}} </p>
            <p> <b>Email</b> : {{email}} </p>
            <p> <b>Address</b> : {{address}} </p>
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="secondary"
                        class="float-left"
                        @click="onCloseView()"
                    >
                        Close
                    </b-button>
                    <b-button
                        variant="primary"
                        class="float-right"
                        @click="onCloseView()"
                    >
                        Save
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import Alert from "../../components/Alert.vue";
// import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';
import Navbar from "../../components/Navbar.vue";
import UserService from "../../services/UserService";

export default {
  components: { Alert, Icon, Navbar },
  name: "User",
  mounted() {
    console.log("Components calling");
  },
  data() {
    return {
      users: [],
      fields: [],
      
      email: '',
      name : '',
      address: '',
      modalTitle: 'Add User',
      errors : [],
      editID : '',
      message: "",
      variant: "",
    };
  },
  created() {
    this.userListing();
  },
  methods: {
    userListing() {
      UserService.listing_users()
        .then((response) => {
          if (response.status == 200 && response.data.response) {
            this.users = response.data.data;
            this.fields = [
              { key: "name", label: "Full Name", sortable: true },
              { key: "email", label: "Email", sortable: true },
              { key: "address", label: "Address", sortable: true },
              { key: "created_at", label: "Created At", sortable: true },
              { key: "actions", label: "Actions" },
            ];
          } else {
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose()
          }
        })
        .catch((error) => {
            console.log('Error : ', error)
            this.message = "Something went wrong please try again.";
            this.variant = "danger";
            this.alertClose()
        });
    },
    onSubmit() {
        if(this.editID) {
            this.onSubmitEdit()
        } else {
            this.errors= []
            var data = {
                name: this.name,
                email: this.email,
                address: this.address
            }
            UserService.create_user(data).then(response => {
                console.log(response);
                if (response.status == 200 && response.data.response) {
                    this.$refs['my-modal'].hide()
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
        }
    },
    showModal() {
        this.$refs['my-modal'].show()
        this.name = ''
        this.email = ''
        this.address = ''
        this.editID = ''
        this.modalTitle = "Add User"
    },
    onClose() {
        this.$refs['my-modal'].hide()
        this.name = ''
        this.email = ''
        this.address = ''
        this.editID = ''
        this.modalTitle = "Add User"
    },
    alertClose() {
        setTimeout(() => {
            this.message = "";
            this.variant = "";
        }, 2000);
    },
    editUser (userData) {
        this.modalTitle = "Edit User" 
        this.email = userData.item.email
        this.address = userData.item.address
        this.name = userData.item.name
        this.editID = userData.item.id
        this.$refs['my-modal'].show()
      },
      onSubmitEdit() {
        this.errors= []
        var data = {
            name: this.name,
            email: this.email,
            address: this.address
        }
        UserService.update_user(data, this.editID).then(response => {
            console.log(response);
            if (response.status == 200 && response.data.response) {
                this.$refs['my-modal'].hide()
                this.message = response.data.message;
                this.variant = "success";
                this.alertClose()
                this.name = ''
                this.email = ''
                this.address = ''
                this.editID = ''
                this.modalTitle = "Add User"
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
            this.editID = ''
            this.modalTitle = "Add User"
        })
      },
      deleteUser (userData) {
        console.log("user data : ", userData);
        var confirmAlert = confirm("Are you sure the delete user ?");
        if (confirmAlert == true) {
            UserService.delete_user(userData.item.id).then(response => {
                if (response.status == 200 && response.data.response) {
                    this.message = response.data.message
                    this.variant = 'success'
                    this.alertClose()
                    this.userListing()
                } else {
                    this.message = "Something went wrong please try again.";
                    this.variant = "danger";
                    this.alertClose()
                }
            }).catch(error => {
                console.log('Error : ', error);
                this.message = "Something went wrong please try again.";
                this.variant = "danger";
                this.alertClose()
            })
        } 
      },
      showUserdata(row) {
        console.log(row);
        this.$refs['view-modal'].show()
        this.name = row.item.name
        this.email = row.item.email
        this.address = row.item.address
      },
    onCloseView() {
        this.$refs['view-modal'].hide()
        this.name = ''
        this.email = ''
        this.address = ''
    }
  },
};
</script>

<style scoped>
    .card-header {
        display: flex;
        justify-content: space-between;
    }
    .table-bordered th, .table-bordered td {
        border: 1px solid #dee2e6;
        vertical-align: middle;
    }
</style>